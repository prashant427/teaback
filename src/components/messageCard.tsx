import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import {Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,} from "@/components/ui/dialog";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponce";
import { toast } from "sonner";

type MessageCardProps = {
id?: string;
content: string;
onDelete?: (id?: string) => void;
};

export default function MessageCard({ id, content, onDelete }: MessageCardProps) {
const [open, setOpen] = React.useState(false);

const confirmDelete = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${id}`);
    if (response.data?.success) {
        toast.success(response.data.message ?? "Message deleted");
        setOpen(false);
        onDelete?.(id);
    } else {
        toast.error(response.data?.message ?? "Failed to delete message");
    }
};



return (
    <Card>
        <CardHeader>
            <CardTitle className="text-xl">Message</CardTitle>
        </CardHeader>

        <CardContent>
            <p className="whitespace-pre-wrap text-md text-muted-foreground">{content}</p>
        </CardContent>

        <CardFooter>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete message</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this message?</DialogDescription>

                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Yes, delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardFooter>
    </Card>
);
}