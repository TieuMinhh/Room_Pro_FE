import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { fetchFeedback, updateFeedbackReply, getTenantsOfTenant } from "@/apis/feedback.apis";
import { CirclePlusIcon, Eye, EyeIcon } from "lucide-react";
import FeedbackForm from "./components/DialogFeedback"


const PAGE_SIZE = 5;

export default function TenantFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyDraft, setReplyDraft] = useState("");
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const [open, setOpen] = useState(false);

  const paginatedData = feedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getTenantsOfTenant();
    setFeedbacks(res.data);
  };



  return (
    <Card className="p-4 space-y-4">
      <Button className="w-full md:w-auto bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-700 text-black" onClick={() => setOpen(true)}>
        <CirclePlusIcon className="mr-2 h-4 w-4 " />
        Feedback
      </Button>
      <div className="hidden md:block overflow-x-auto rounded-lg border ">
        <Table className="min-w-[700px] bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.reverse().map((fb, idx) => (
              <TableRow key={fb._id}>
                <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                <TableCell>{fb.ownerName}</TableCell>
                <TableCell>{fb.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2 max-w-[200px] overflow-x-auto">
                    {fb.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Ảnh ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${fb.status === "Pending" ? "text-yellow-600" : "text-green-600"
                      }`}
                  >
                    {fb.status}
                  </span>
                </TableCell>
                <TableCell>{fb.reply}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <p className="text-sm">
            Trang <strong>{page}</strong> / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Trước
            </Button>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
      <FeedbackForm open={open} setOpen={setOpen} fetchData={fetchData} />
    </Card>
  );
}
