import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

// Helper function to format date and time (can be moved to a utils file)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" }; // Fuller date format
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  const options = { hour: "numeric", minute: "2-digit", hour12: true };
  return date.toLocaleTimeString(undefined, options);
};

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "upcoming":
      return {
        text: "Upcoming",
        color: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-300",
      };
    case "in review":
    case "in_review":
      return {
        text: "In Review",
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-300",
      };
    case "cancelled":
      return {
        text: "Cancelled",
        color: "text-rose-700",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-300",
      };
    case "overdue":
      return {
        text: "Overdue",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300",
      };
    case "published":
      return {
        text: "Published",
        color: "text-sky-700",
        bgColor: "bg-sky-50",
        borderColor: "border-sky-300",
      };
    default:
      return {
        text: status || "Unknown",
        color: "text-slate-700",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-300",
      };
  }
};

const ViewMeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeetingDetails = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`/api/meetings/${id}/`);
      setMeeting(response.data);
    } catch (err) {
      console.error("Error fetching meeting details:", err);
      setError("Failed to load meeting details.");
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        navigate("/login");
      } else if (err.response && err.response.status === 404) {
        setError("Meeting not found.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchMeetingDetails();
  }, [fetchMeetingDetails]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading meeting details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex justify-center items-center h-screen">
        Meeting data not available.
      </div>
    );
  }

  const statusStyle = getStatusStyles(meeting.status);

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 break-words">
            {meeting.agenda}
          </h1>
          <Link
            to="/meetings"
            className="mt-3 md:mt-0 text-sm text-violet-600 hover:text-violet-800 transition-colors"
          >
            &larr; Back to Meetings List
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1">Status</p>
            <span
              className={`px-3 py-1 inline-flex text-xs leading-tight font-semibold rounded-md border ${statusStyle.bgColor} ${statusStyle.color} ${statusStyle.borderColor}`}
            >
              {statusStyle.text}
            </span>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Date of Meeting</p>
            <p className="text-gray-700">
              {formatDate(meeting.date_of_meeting)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Start Time</p>
            <p className="text-gray-700">{formatTime(meeting.start_time)}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Meeting URL</p>
            <a
              href={meeting.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline break-all"
            >
              {meeting.meeting_url}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <Link
            to={`/meetings/edit/${meeting.id}`}
            className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-colors flex items-center text-sm"
          >
            Edit Meeting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewMeetingPage;
