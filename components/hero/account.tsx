"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, reloadUser } = useUserContext();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    ageGroup: "",
    customerType: "",
    image: "",
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Sync with current user
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        ageGroup: user.ageGroup || "",
        customerType: user.customerType || "",
        image: user.image || "",
      });
    }
  }, [user]);

  // Detect changes to enable/disable save button
  useEffect(() => {
    if (!user) return;

    const changed =
      profile.name !== user.name ||
      profile.email !== user.email ||
      profile.phone !== user.phone ||
      profile.ageGroup !== user.ageGroup ||
      profile.customerType !== user.customerType ||
      profile.password !== "" || // password typed counts as change
      profile.image !== user.image;

    setHasChanges(changed);
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile({ ...profile, [name]: value });
  };

  // Convert selected image to base64 for backend
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user?._id) throw new Error("User not loaded");

      if (!hasChanges) {
        toast("No changes detected!");
        return;
      }

      const payload: any = { ...profile, avatar: profile.image };
      if (!payload.password) delete payload.password;

      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }

      reloadUser();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Profile update failed");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center p-6 lg:p-12 mt-16 bg-zinc-950">
      <div className="w-full max-w-3xl bg-neutral-900 text-white rounded-2xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-neutral-500 text-center">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <label className="cursor-pointer relative">
            <Avatar className="w-24 h-24">
              {profile.image ? (
                <AvatarImage src={profile.image} />
              ) : (
                <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold">
              Change
            </div>
          </label>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Name</Label>
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-3">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-3">
            <Label>Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-3">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-3 w-full">
            <Label>Age Group</Label>
            <Select
              onValueChange={(value) => handleSelectChange("ageGroup", value)}
              value={profile.ageGroup}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="adult">Adult</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="old">Old</SelectItem>
                <SelectItem value="child">Child</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Customer Type</Label>
            <Input value={profile.customerType} readOnly />
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="secondary"
            onClick={handleSubmit}
            className="w-full"
            disabled={!hasChanges} // Disabled until any change
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
