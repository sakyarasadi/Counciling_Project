import React from "react";
import { useRoutes } from "react-router-dom";
import Register from "../pages/static/register/User/register"; 
import Login from "../pages/static/login/login";
import QuestionCheck from "../pages/dynamic/user/question_check/question_check";
import FormApproval from "../pages/static/register/CounselorPsychiatrist/approval";
import ApprovalList from "../pages/dynamic/admin/request_approval/request_approval"
import ApprovalDeleteList from "../pages/dynamic/admin/deleteapproval/deleteApprovals";
import ApprovedPersonList from "../pages/dynamic/admin/approvedone/approvedOne";
import UserList from "../pages/dynamic/admin/users/users_admin";
import HomePage from "../pages/static/home/home";
import ProfilePage from "../pages/dynamic/Counselor_Psychiatrist/profile";
import LandingPage from "../pages/dynamic/user/landingPage/landingPage"
import Depression from "../pages/static/diseases/depression";
import Report from "../pages/dynamic/user/Report/report";
import CouncilorRequest from "../pages/dynamic/user/CouncilorRequest/councilorRequest";
import Chat from "../pages/dynamic/user/chat/chat";
import CouncilorRequestList from "../pages/dynamic/Counselor_Psychiatrist/CouncilorRequestsList/CouncilorRequestsList";
import ChatCouncilor from "../pages/dynamic/Counselor_Psychiatrist/chat-councilor/chat-concilor"
import AppointmentCouncilor from "../pages/dynamic/Counselor_Psychiatrist/Appointments_councilor/appointment";
import AppointmentUser from "../pages/dynamic/user/Appointments_user/apointment";

export default function RouterConfig() {
    return(
        useRoutes([
            {
                path: "/",
                element: <HomePage/>

            },
            {
                path: "/register",
                element: <Register/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path:"/landingPage",
                element: <LandingPage/>

            },
            {
                path:"/question-check",
                element: <QuestionCheck/>
            },
            {
                path:"/profile_cp",
                element: <ProfilePage/>
            },
            {
                path:"/approval",
                element: <FormApproval/>
            },
            {
                path:"/approval-list",
                element: <ApprovalList/>
            },
            {
                path:"/approvalDelete-list",
                element: <ApprovalDeleteList/>
            },
            {
                path:"/approvedPerson-list",
                element: <ApprovedPersonList/>
            },
            {
                path:"/user-list",
                element: <UserList/>
            },
            {
                path:"/depression",
                element: <Depression/>
            },
            {
                path:"/report",
                element: <Report/>
            },
            {
                path:"/councilorRequest",
                element: <CouncilorRequest/>
            },
            {
                path:"/Userchat",
                element: <Chat/>
            },
            {
                path:"/CouncilorRequestList",
                element: <CouncilorRequestList/>
            },
            {
                path:"/ChatCouncilor",
                element: <ChatCouncilor/>
            },
            {
                path:"/AppointmentCouncilor",
                element: <AppointmentCouncilor/>
            },
            {
                path:"/AppointmentUser",
                element: <AppointmentUser/>
            }
            
        ])

    )
}


