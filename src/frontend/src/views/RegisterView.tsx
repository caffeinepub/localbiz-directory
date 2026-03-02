import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Building2, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { View } from "../App";
import type { BusinessInput } from "../backend.d";
import { backend } from "../backendClient";

interface RegisterViewProps {
  navigate: (view: View) => void;
  isLoggedIn: boolean;
}

const CATEGORIES = [
  "Restaurants",
  "Shops",
  "Services",
  "Health",
  "Professionals",
  "Others",
];

export default function RegisterView({
  navigate,
  isLoggedIn,
}: RegisterViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    hours: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (input: BusinessInput) => {
      await backend.submitBusiness(input);
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      toast.error("Failed to submit business. Please try again.");
    },
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Business name is required.");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }
    if (!form.address.trim()) {
      toast.error("Address is required.");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const input: BusinessInput = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      hours: form.hours.trim(),
    };

    submitMutation.mutate(input);
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary flex items-center justify-center">
          <Building2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Sign in to Register
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          You need to be signed in to register your business in the directory.
        </p>
        <Button
          onClick={() => navigate({ name: "home" })}
          variant="outline"
          className="font-ui"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        data-ocid="register.success_state"
        className="container mx-auto px-4 max-w-2xl py-16 text-center"
      >
        <div className="bg-card rounded-2xl border border-border p-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-status-approved/20 flex items-center justify-center border-2 border-status-approved">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Business Submitted!
          </h2>
          <p className="text-muted-foreground font-body max-w-sm mx-auto mb-2">
            Your business listing has been submitted and is pending admin
            review.
          </p>
          <p className="text-sm text-muted-foreground font-body mb-8">
            You'll be able to see it in <strong>My Listings</strong> while it
            awaits approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate({ name: "my-listings" })}
              className="font-ui bg-primary text-primary-foreground"
            >
              View My Listings
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "",
                  category: "",
                  description: "",
                  address: "",
                  phone: "",
                  email: "",
                  website: "",
                  hours: "",
                });
              }}
              className="font-ui"
            >
              Register Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ name: "home" })}
        className="mb-6 -ml-2 font-ui text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Directory
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-ui font-medium mb-4">
          <Building2 className="w-3.5 h-3.5" />
          Business Registration
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Register Your Business
        </h1>
        <p className="text-muted-foreground font-body">
          Submit your business for inclusion in our verified local directory.
          Our team will review your listing within 24-48 hours.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-6"
      >
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="reg-name" className="font-ui text-sm font-medium">
            Business Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reg-name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. The Corner Bakery"
            data-ocid="register.name_input"
            className="font-body"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="font-ui text-sm font-medium">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.category}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, category: val }))
            }
          >
            <SelectTrigger
              data-ocid="register.category_select"
              className="font-body"
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="font-body">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="reg-desc" className="font-ui text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="reg-desc"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Describe your business, services, and what makes you unique..."
            data-ocid="register.description_input"
            className="font-body resize-none"
            rows={4}
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="reg-address" className="font-ui text-sm font-medium">
            Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reg-address"
            value={form.address}
            onChange={handleChange("address")}
            placeholder="123 Main St, City, State 12345"
            data-ocid="register.address_input"
            className="font-body"
            required
          />
        </div>

        {/* Phone & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reg-phone" className="font-ui text-sm font-medium">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+1 (555) 000-0000"
              data-ocid="register.phone_input"
              className="font-body"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email" className="font-ui text-sm font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="hello@yourbusiness.com"
              data-ocid="register.email_input"
              className="font-body"
              required
            />
          </div>
        </div>

        {/* Website & Hours */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="reg-website"
              className="font-ui text-sm font-medium"
            >
              Website
            </Label>
            <Input
              id="reg-website"
              type="url"
              value={form.website}
              onChange={handleChange("website")}
              placeholder="https://yourbusiness.com"
              data-ocid="register.website_input"
              className="font-body"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-hours" className="font-ui text-sm font-medium">
              Business Hours
            </Label>
            <Input
              id="reg-hours"
              value={form.hours}
              onChange={handleChange("hours")}
              placeholder="Mon-Fri 9AM-6PM, Sat 10AM-4PM"
              data-ocid="register.hours_input"
              className="font-body"
            />
          </div>
        </div>

        {/* Info box */}
        <div className="p-4 bg-amber/5 rounded-lg border border-amber/20">
          <p className="text-sm text-muted-foreground font-body">
            <span className="font-medium text-foreground">Review Process:</span>{" "}
            Your submission will be reviewed by our team within 24-48 hours.
            Once approved, your business will appear in the public directory.
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitMutation.isPending}
          data-ocid="register.submit_button"
          className="w-full h-11 font-ui font-medium bg-primary text-primary-foreground"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 mr-2" /> Submit Business
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
