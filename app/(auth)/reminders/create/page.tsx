"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Header from "@/components/header";
import { createCrudBreadcrumb, CRUD, remindersPage } from "@/constants/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { reminderService } from "@/services/reminder-service";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  category: yup.string().required("Category is required"),
  dueDate: yup.date().required("Due date is required"),
  hasTime: yup.boolean(),
  dueTime: yup.string().when("hasTime", {
    is: true,
    then: (schema) => schema.required("Time is required when enabled"),
    otherwise: (schema) => schema.nullable(),
  }),
  priority: yup.string().required("Priority is required"),
  recurrence: yup.string().required("Recurrence is required"),
  description: yup.string(),
});

export default function CreateReminderPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      dueDate: null as Date | null,
      hasTime: false,
      dueTime: "",
      priority: "medium",
      recurrence: "none",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user) {
        toast.error("You must be logged in to create a reminder");
        return;
      }
      try {
        const reminderData = {
          title: values.title,
          category: values.category,
          due_date: values.dueDate!.toISOString().split('T')[0],
          due_time: values.hasTime ? values.dueTime : null,
          priority: values.priority,
          recurrence: values.recurrence,
          description: values.description || null,
          user_id: user.id,
          is_completed: false,
        };
        await reminderService.createReminder(reminderData);
        toast.success("Reminder created successfully");
        router.push("/reminders");
      } catch (error) {
        console.error("Error creating reminder:", error);
        toast.error("Failed to create reminder");
      }
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    formik.setFieldValue("dueDate", date || null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("dueTime", e.target.value);
  };

  const handleHasTimeChange = (checked: boolean) => {
    formik.setFieldValue("hasTime", checked);
    if (!checked) {
      formik.setFieldValue("dueTime", "");
    }
  };

  if (userLoading) {
    return (
      <main id="main">
        <Header breadcrumbs={createCrudBreadcrumb(remindersPage, CRUD.CREATE)} />
        <div className="px-4 py-6">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main id="main">
      <Header breadcrumbs={createCrudBreadcrumb(remindersPage, CRUD.CREATE)} />

      <div className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Reminder</CardTitle>
            <CardDescription>
              Set a reminder for important tasks and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Reminder title..."
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.title && formik.errors.title && "border-destructive"
                      )}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-sm text-destructive">{formik.errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </label>
                    <Select
                      value={formik.values.category}
                      onValueChange={(value) => formik.setFieldValue("category", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bill">Bill Payment</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-sm text-destructive">{formik.errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formik.values.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formik.values.dueDate ? format(formik.values.dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formik.values.dueDate || undefined}
                          onSelect={handleDateSelect}
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.dueDate && formik.errors.dueDate && (
                      <p className="text-sm text-destructive">{formik.errors.dueDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasTime"
                        checked={formik.values.hasTime}
                        onCheckedChange={handleHasTimeChange}
                      />
                      <Label htmlFor="hasTime" className="text-sm font-medium">
                        Set Specific Time
                      </Label>
                    </div>
                    {formik.values.hasTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dueTime"
                          name="dueTime"
                          type="time"
                          value={formik.values.dueTime}
                          onChange={handleTimeChange}
                          onBlur={formik.handleBlur}
                          className="flex-1"
                        />
                      </div>
                    )}
                    {formik.touched.dueTime && formik.errors.dueTime && (
                      <p className="text-sm text-destructive">{formik.errors.dueTime}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={formik.values.priority}
                      onValueChange={(value) => formik.setFieldValue("priority", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="recurrence" className="text-sm font-medium">
                      Recurrence
                    </label>
                    <Select
                      value={formik.values.recurrence}
                      onValueChange={(value) => formik.setFieldValue("recurrence", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Does this repeat?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Does not repeat</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col col-span-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    className="flex-1"
                    id="description"
                    name="description"
                    placeholder="Add details about this reminder..."
                    rows={3}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 w-fit ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={formik.isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!formik.isValid || formik.isSubmitting || !user}
                >
                  {formik.isSubmitting ? "Creating..." : "Create Reminder"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}