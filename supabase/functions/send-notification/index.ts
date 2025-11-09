/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SEND-NOTIFICATION] ${step}${detailsStr}`);
};

// Firebase Admin SDK equivalent for Deno
async function sendFCMNotification(fcmToken: string, reminder: any) {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title: `${reminder.title}`,
        body: reminder.description || "Time is up!",
      },
      webpush: {
        notification: { icon: "https://my-orbit-alpha.vercel.app/logo.png" },
        fcmOptions: { link: "https://my-orbit-alpha.vercel.app/reminders" },
        headers: { TTL: "86400000", Urgency: "high" },
      },
    };

    const token = await getAccessToken();
    const options = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    };

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${Deno.env.get("FIREBASE_PROJECT_ID")}/messages:send`,
      options,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FCM API error:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in sendFCMNotification:", error);
    return false;
  }
}

// Simplified access token generation
async function getAccessToken() {
  const serviceAccount = {
    client_email: Deno.env.get("FIREBASE_CLIENT_EMAIL"),
    private_key: Deno.env.get("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
  };

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  // Base64URL encode (not standard base64)
  const base64UrlEncode = (str: string) => {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Convert PEM to binary format
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = serviceAccount.private_key!.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");
  // Decode base64 to binary
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  // Import the key
  const key = await crypto.subtle.importKey("pkcs8", binaryDer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"],);
  const signature = await crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, key, new TextEncoder().encode(signatureInput),);
  // Base64URL encode signature
  const encodedSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
  const jwt = `${signatureInput}.${encodedSignature}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!response.ok) {
    const errorText = await response.text();
    logStep("Token request failed", errorText);
    throw new Error(`Failed to get access token: ${errorText}`);
  }
  const data = await response.json();
  logStep("Obtained access token", data.access_token);

  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { id, user_id, title, description, priority } = await req.json();
    // Get user's FCM tokens (you'll need to implement this with your Supabase client)
    const { data: tokens, error } = await supabase.from("user_push_tokens").select("fcm_token").eq("user_id", user_id).eq("enabled", true);

    if (error || !tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ message: "No FCM tokens found", error: error?.message, tokens }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1);
    const reminder = {
      id, user_id, title,
      description: description || `Priority: ${formattedPriority}`,
    };

    let successful = 0;

    // Send to all user's devices
    for (const token of tokens) {
      const success = await sendFCMNotification(token.fcm_token, reminder);
      if (success) successful++;
    }

    return new Response(
      JSON.stringify({ success: true, sent_to: successful, total_tokens: tokens.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
