import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const serviceAccount = JSON.parse(
  atob(Deno.env.get("FIREBASE_SERVICE_ACCOUNT")!),
);

async function getFirebaseAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  const signatureInput = `${base64Header}.${base64Payload}`;
  const privateKey = serviceAccount.private_key.replace(/\\n/g, "\n");
  const signature = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    await crypto.subtle.importKey(
      "pkcs8",
      new TextEncoder().encode(privateKey),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      [
        "sign",
      ],
    ),
    new TextEncoder().encode(signatureInput),
  );
  const base64Signature = btoa(
    String.fromCharCode(...new Uint8Array(signature)),
  );
  const jwt = `${signatureInput}.${base64Signature}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await response.json();
  return data.access_token;
}

async function sendFCMNotification(fcmToken, reminder) {
  try {
    const accessToken = await getFirebaseAccessToken();
    const message = {
      message: {
        token: fcmToken,
        notification: {
          title: `🔔 ${reminder.title}`,
          body: reminder.description || "Time is up!",
        },
        data: {
          reminderId: reminder.id,
          type: "reminder",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
        },
        android: {
          priority: "high",
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      },
    };
    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Error sending FCM:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const { id, user_id, title, description, priority } = await req.json();
    // Get user's FCM tokens
    const { data: tokens, error } = await supabase.from("user_push_tokens")
      .select("fcm_token").eq("user_id", user_id).eq("enabled", true);
    if (error || !tokens || tokens.length === 0) {
      console.log(error, tokens);
      return new Response(
        JSON.stringify({ message: "No FCM tokens found", error, tokens }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }
    const reminder = {
      id,
      user_id,
      title,
      description: `Priority: ${priority}`,
    };
    let successful = 0;
    // Send to all user's devices
    for (const token of tokens) {
      const success = await sendFCMNotification(token.fcm_token, reminder);
      if (success) successful++;
    }
    return new Response(
      JSON.stringify({
        success: true,
        sent_to: successful,
        total_tokens: tokens.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
