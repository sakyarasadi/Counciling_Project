import axios from "axios";

interface PostDataServicePromiseMsg {
    title: string;
    message: string;
}

interface PostDataServicePromise {
    success: boolean;
    data: any;
    message: PostDataServicePromiseMsg;
    meta: string;
    errors: any;
    status: number;
}

const PostDataService = async (
    endpoint: string,
    data: any,
    p0?: { headers: { Authorization: string } }
) => {
    console.log("Post Data Service");

    try {
        console.log("End Point :", endpoint);
        console.log("Data :", data);

        let result: PostDataServicePromise = {
            success: false,
            data: {},
            message: {
                title: "",
                message: "",
            },
            meta: "",
            errors: "",
            status: 0,
        };

        const BASE_URL: string = "http://127.0.0.1:5000";

        const res = await axios.post(BASE_URL + endpoint, data, p0);
        console.log("Response :", res);

        result = res.data.response;

        console.log("Result :", result);

        return result;
    } catch (e: any) {
        console.log("Catch Error :", e);
        const result: PostDataServicePromise = {
            success: false,
            data: {},
            message: {
                title: e.response?.data?.message?.title || "Error",
                message: e.response?.data?.message?.message || "An error occurred",
            },
            meta: "",
            errors: e.response?.data?.errors || "",
            status: e.response?.status || 0,
        };
        return result;
    }
};

export default PostDataService;
