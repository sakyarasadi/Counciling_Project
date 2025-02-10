import axios from "axios";

interface GetDataServicePromiseMsg {
    title: string;
    message: string;
}

interface GetDataServicePromise {
    success: boolean;
    data: any;
    message: GetDataServicePromiseMsg;
    meta: string;
    errors: any;
    status: number;
}

const GetDataService = async (
    endpoint: string,
    p0?: { headers: { "X-User-Email": string } } 
) => {
    console.log("Get Data Service");

    try {
        console.log("End Point :", endpoint);

        let result: GetDataServicePromise = {
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

        const res = await axios.get(BASE_URL + endpoint, p0);
        console.log("Response :", res);

        // Access the nested `response` object
        result = res.data.response;

        console.log("Result :", result);

        return result;
    } catch (e: any) {
        console.log("Catch Error :", e);
        const result: GetDataServicePromise = {
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

export default GetDataService;
