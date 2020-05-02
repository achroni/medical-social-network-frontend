// Notification verb to friendly name from timestamp getrequests
export const notificationVerbToFriendlyDict = {
  friend_request: "Friends",
  care_team: "Care Team",
  circle_of_trust_request: "Circle Of Trust"
};

// Notification verb to endpoint url that handles the request (acccept/decline)
export const notificationVerbToUrlDict = {
  friend_request: "friend_requests",
  care_team: "care_team_requests",
  circle_of_trust_request: "circle_of_trust"
};

// Notification verb to state redux requests by category
export const notificationVerbToRequests = {
  friend_request: "friend_requests",
  care_team: "care_team_requests",
  circle_of_trust_request: "circle_of_trust_requests",
  health_score: "health_score_requests"
};

// Message of outgoing requests
export const outgoingRequestsMessage = {
  friend_request: "friend",
  circle_of_trust_request: "circle_of_trust",
  care_team: "care_team"
};

// Message of outgoing requests sent
export const outgoingRequestsMessageSent = {
  friend_request: "sent_request_id_friend",
  circle_of_trust_request: "sent_request_id_circle_of_trust",
  care_team: "sent_request_id_care_team"
};

// type to endpoint url that sends a new request
export const sendRequestUrlDict = {
  friend: "friends",
  circle_of_trust: "circle_of_trust",
  care_team: "care_team",
  care_team_doctor: "request/doctor"
};

//type of Post to label
export const postTypeDict = {
  text_post: "Text",
  article_post: "Article",
  doctor_recommendation_post: "Doctor Recommendation",
  appointment_post: "Appointment",
  prescription_post: "Prescription",
  personal_measurements: "Personal Measurements",
  medicine_dosage: "Medicine Dosage"
};
