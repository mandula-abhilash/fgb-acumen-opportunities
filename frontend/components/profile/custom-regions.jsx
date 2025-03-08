"use client";

import { useEffect, useState } from "react";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";

import {
  createCustomRegion,
  deleteCustomRegion,
  getRegions,
  updateCustomRegion,
} from "@/lib/api/regions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function CustomRegions() {
  const { toast } = useToast();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState(null);
  const [editingRegion, setEditingRegion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchRegions = async () => {
    try {
      const data = await getRegions();
      // Filter out default regions
      setRegions(data.filter((region) => !region.is_default));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch regions",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleOpenDialog = (region = null) => {
    if (region) {
      setEditingRegion(region);
      setFormData({
        name: region.label,
        description: region.description || "",
      });
    } else {
      setEditingRegion(null);
      setFormData({ name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRegion(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingRegion) {
        await updateCustomRegion(editingRegion.value, formData);
        toast({
          title: "Success",
          description: "Region updated successfully",
        });
      } else {
        await createCustomRegion(formData);
        toast({
          title: "Success",
          description: "Region created successfully",
        });
      }
      handleCloseDialog();
      fetchRegions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to save region. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (region) => {
    setRegionToDelete(region);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!regionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCustomRegion(regionToDelete.value);
      toast({
        title: "Success",
        description: "Region deleted successfully",
      });
      fetchRegions();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete region",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setRegionToDelete(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Spinner size="lg" className="text-web-orange" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Custom Regions</CardTitle>
          <CardDescription className="mt-2">
            Create and manage your custom regions
          </CardDescription>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-web-orange hover:bg-web-orange/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Region
        </Button>
      </CardHeader>
      <CardContent>
        {regions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No custom regions yet. Click "Add Region" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {regions.map((region) => (
              <div
                key={region.value}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{region.label}</h3>
                  {region.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {region.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(region)}
                    disabled={isSaving}
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit region</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(region)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete region</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRegion ? "Edit Region" : "Add New Region"}
            </DialogTitle>
            <DialogDescription>
              {editingRegion
                ? "Update your custom region details"
                : "Create a new custom region"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Region Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter region name"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter region description"
                  rows={3}
                  disabled={isSaving}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-web-orange hover:bg-web-orange/90 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingRegion ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingRegion ? "Update Region" : "Create Region"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Region</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{regionToDelete?.label}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
