import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {
  InteractionStatus,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { callMsGraph } from "../utils/MsGraphApiCall";
import { loginRequest } from "../authConfig";
import LoadingSpinner from "../ui-components/LoadingSpinner";
import CountdownTimer from "../ui-components/Countdown";
import ErrorPage from "./ErrorPage";

const StreamRedirect = () => {
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionPending, setSessionPending] = useState(false);
  const [responseData, setResponseData] = useState(null); // State for countdown data
  const [error, setError] = useState(null); // State for error data
  const navigate = useNavigate();

  useEffect(() => {
    if (!graphData && inProgress === InteractionStatus.None) {
      callMsGraph()
        .then((response) => {
          setGraphData(response);
          setLoading(false); // Set loading to false once data is retrieved
        })
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: instance.getActiveAccount(),
            });
          }
          setLoading(false); // Ensure loading is false even if there's an error
          setError(e); // Set error state if data retrieval fails
        });
    }
  }, [inProgress, graphData, instance]);

  useEffect(() => {
    const fetchStreamUrl = async () => {
      if (graphData && graphData.mail) {
        try {
          const response = await axios.get(
            `https://kecsb4zutd.execute-api.ap-south-1.amazonaws.com/dev/as-user?userId=${graphData.mail}`
          );

          if (response.data.stream_url) {
            window.location.href = response.data.stream_url;
          } else if (
            response.data.statusCode === 403 &&
            response.data.message === "User should wait until session starts"
          ) {
            setSessionPending(true);
            setResponseData(response.data); // Set the response data for countdown
          } else {
            setError(response.data); // Set error if response does not contain stream URL or session pending
          }
        } catch (error) {
          console.error("Error fetching stream URL:", error);
          setError(error.response?.data || { message: "An error occurred." });
        }
      }
    };

    fetchStreamUrl();
  }, [graphData]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorPage response={error} />;
  }

  return (
    <div>
      {sessionPending && responseData ? (
        <CountdownTimer response={responseData} />
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default StreamRedirect;
