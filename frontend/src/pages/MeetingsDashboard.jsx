import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from "../components/DropdownMenu";

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
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

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "upcoming":
      return "bg-emerald-50 text-emerald-700 border border-emerald-300";
    case "in review":
    case "in_review":
      return "bg-amber-50 text-amber-700 border border-amber-300";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border border-rose-300";
    case "overdue":
      return "bg-orange-50 text-orange-700 border border-orange-300";
    case "published":
      return "bg-sky-50 text-sky-700 border border-sky-300";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-300";
  }
};

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

const MeetingsDashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [checkedMeetings, setCheckedMeetings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/meetings/");
      setMeetings(response.data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again.");
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDelete = async (meetingId) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        await axios.delete(`/api/meetings/${meetingId}/`);
        setMeetings((prev) =>
          prev.filter((meeting) => meeting.id !== meetingId)
        );
      } catch (err) {
        console.error("Error deleting meeting:", err);
        setError("Failed to delete meeting. Please try again.");
      }
    }
  };

  const toggleCheckbox = (id) => {
    setCheckedMeetings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRowClick = (e, meetingId) => {
    if (
      e.target.tagName.toLowerCase() !== "input" &&
      !e.target.closest("button") &&
      !e.target.closest("a")
    ) {
      navigate(`/meetings/view/${meetingId}`);
    }
  };

  if (isLoading && meetings.length === 0) {
    return <div className="text-center py-10">Loading meetings...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 bg-main-bg">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Meetings</h1>
          <div className="mt-2 flex items-center space-x-3 md:space-x-4 text-sm">
            <span className="text-violet-600 font-medium border-b-2 border-violet-600 pb-1 px-1">
              List
            </span>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer pb-1 px-1">
              Grid
            </span>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer pb-1 px-1">
              Calendar
            </span>
          </div>
        </div>
        <Link
          to="/meetings/new"
          className="mt-4 md:mt-0 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center space-x-1.5 text-sm"
        >
          <PlusIcon />
          <span>Add New</span>
        </Link>
      </div>

      {meetings.length === 0 && !isLoading ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No meetings scheduled
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new meeting.
          </p>
          <div className="mt-6">
            <Link
              to="/meetings/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700"
            >
              <PlusIcon />
              <span className="ml-2">New Meeting</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg">
          <div className="h-[70vh] overflow-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Agenda
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date of Meeting
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Meeting URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meetings.map((meeting) => {
                  const isChecked = checkedMeetings[meeting.id];
                  return (
                    <tr
                      key={meeting.id}
                      className={`cursor-pointer transition duration-150 ease-in-out hover:bg-slate-50 ${
                        isChecked ? "border-l-4 border-green-500" : ""
                      }`}
                      onClick={(e) => handleRowClick(e, meeting.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onChange={() => toggleCheckbox(meeting.id)}
                          className="h-4 w-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {meeting.agenda}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-md ${getStatusColor(
                            meeting.status
                          )}`}
                        >
                          {meeting.status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(meeting.date_of_meeting)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatTime(meeting.start_time)}
                      </td>
                      <td className="px-4 py-3 text-sm truncate max-w-[180px] md:max-w-[220px]">
                        <a
                          href={meeting.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                          title={meeting.meeting_url}
                        >
                          {meeting.meeting_url}
                        </a>
                      </td>
                      <td
                        className="px-4 py-3 text-center text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu
                          meetingId={meeting.id}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsDashboard;
