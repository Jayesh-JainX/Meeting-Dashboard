import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const AddEditMeetingPage = () => {
  const { id } = useParams(); // For editing existing meeting
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    agenda: "",
    status: "upcoming", // Default status
    date_of_meeting: "",
    start_time: "",
    meeting_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("Add New Meeting");

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "in_review", label: "In Review" },
    { value: "cancelled", label: "Cancelled" },
    { value: "overdue", label: "Overdue" },
    { value: "published", label: "Published" },
  ];

  const fetchMeetingDetails = useCallback(async () => {
    if (isEditMode) {
      setIsLoading(true);
      setPageTitle("Edit Meeting");
      try {
        const response = await axios.get(`/api/meetings/${id}/`);
        const meetingData = response.data;
        // Format date and time for input fields
        setFormData({
          agenda: meetingData.agenda,
          status: meetingData.status,
          date_of_meeting: meetingData.date_of_meeting, // Expects YYYY-MM-DD
          start_time: meetingData.start_time.substring(0, 5), // Expects HH:MM
          meeting_url: meetingData.meeting_url,
        });
      } catch (err) {
        console.error("Error fetching meeting details:", err);
        setError("Failed to load meeting details. Please try again.");
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
    }
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    fetchMeetingDetails();
  }, [fetchMeetingDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (
      !formData.agenda ||
      !formData.date_of_meeting ||
      !formData.start_time ||
      !formData.meeting_url
    ) {
      setError("All fields except status are required.");
      setIsLoading(false);
      return;
    }

    // Ensure time is in HH:MM:SS format if backend expects it, or just HH:MM
    const payload = {
      ...formData,
      start_time:
        formData.start_time.includes(":") &&
        formData.start_time.split(":").length === 2
          ? `${formData.start_time}:00`
          : formData.start_time,
    };

    try {
      if (isEditMode) {
        await axios.put(`/api/meetings/${id}/`, payload);
      } else {
        await axios.post("/api/meetings/", payload);
      }
      navigate("/meetings"); // Redirect to dashboard after successful submission
    } catch (err) {
      console.error("Error submitting form:", err);
      if (err.response && err.response.data) {
        // Handle specific field errors from backend if available
        let errorMessages = [];
        for (const key in err.response.data) {
          errorMessages.push(
            `${key}: ${
              err.response.data[key].join
                ? err.response.data[key].join(", ")
                : err.response.data[key]
            }`
          );
        }
        setError(
          errorMessages.join("; ") ||
            "Failed to save meeting. Please check your input."
        );
      } else {
        setError("Failed to save meeting. Please try again.");
      }
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode && !formData.agenda) {
    // Show loading only when fetching for edit mode initially
    return <div className="text-center py-10">Loading meeting details...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
        <Link to="/meetings" className="text-purple-600 hover:underline">
          &larr; Back to Meetings
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6"
      >
        <div>
          <label
            htmlFor="agenda"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Agenda
          </label>
          <input
            type="text"
            name="agenda"
            id="agenda"
            value={formData.agenda}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="E.g., Weekly Team Sync"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date_of_meeting"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Meeting
            </label>
            <input
              type="date"
              name="date_of_meeting"
              id="date_of_meeting"
              value={formData.date_of_meeting}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="meeting_url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Meeting URL
          </label>
          <input
            type="url"
            name="meeting_url"
            id="meeting_url"
            value={formData.meeting_url}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            placeholder="https://zoom.us/j/1234567890"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </p>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Link
            to="/meetings"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isLoading
              ? isEditMode
                ? "Saving..."
                : "Adding..."
              : isEditMode
              ? "Save Changes"
              : "Add Meeting"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditMeetingPage;
