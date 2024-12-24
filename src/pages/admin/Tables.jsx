import React, { useEffect, useState, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Button,
  Typography,
  Tooltip,
} from "antd";
import { ToTopOutlined, CopyOutlined } from "@ant-design/icons";
import axios from "axios";
import LoadingSpinner from "../../ui-components/LoadingSpinner";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const columns = [
  {
    title: "User Email",
    dataIndex: "email",
    key: "email",
    width: "20%",
  },
  {
    title: "Session Count",
    dataIndex: "sessionCount",
    key: "sessionCount",
    width: "20%",
  },
];

const expandedRowRender = (record) => {
  const innerColumns = [
    {
      title: "Session ID",
      dataIndex: "sessionID",
      key: "sessionID",
      width: "20%",
      render: (text) => (
        <div className="flex items-center">
          <Tooltip title={text}>
            <span className="truncate w-32">{text}</span>
          </Tooltip>
          <Button
            icon={<CopyOutlined />}
            size="small"
            onClick={() => navigator.clipboard.writeText(text)}
            className="ml-2"
          />
        </div>
      ),
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      width: "20%",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: "20%",
    },
    {
      title: "Status",
      key: "session_status",
      dataIndex: "session_status",
      width: "20%",
      render: (status) => {
        let color;
        switch (status.toLowerCase()) {
          case "active":
            color = "bg-green-500";
            break;
          case "deactive":
            color = "bg-red-500";
            break;
          case "inactive":
            color = "bg-yellow-500";
            break;
          default:
            color = "bg-gray-500";
        }
        return (
          <span className={`px-2 py-1 rounded text-white ${color}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <Table
      columns={innerColumns}
      dataSource={record.sessions}
      pagination={false}
    />
  );
};

function Tables() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("createdTime");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [searchColumn, setSearchColumn] = useState("email");
  const [todayFilter, setTodayFilter] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        searchColumn,
        searchValue: searchTerm,
        sortColumn,
        sortOrder,
      };

      if (statusFilter !== "all") {
        params.statusFilter = statusFilter;
      }

      const response = await axios.get(
        "https://pdadd4zki6.execute-api.ap-south-1.amazonaws.com/dev/user-session",
        { params, timeout: 10000 } // Set timeout to 10 seconds
      );

      const data = response.data.data; // Access the data array
      console.log(data);

      setUserData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, [searchColumn, searchTerm, sortColumn, sortOrder, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = userData.filter((user) => {
    const createdTime = new Date(user.createdTime);
    createdTime.setTime(createdTime.getTime() + 5.5 * 60 * 60 * 1000); // Add 5 hours and 30 minutes

    const matchesSearchTerm =
      user[searchColumn] &&
      user[searchColumn].toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      user.session_status.toLowerCase() === statusFilter;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    startOfDay.setTime(startOfDay.getTime() + 5.5 * 60 * 60 * 1000); // Adjust to Sri Lankan time

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    endOfDay.setTime(endOfDay.getTime() + 5.5 * 60 * 60 * 1000); // Adjust to Sri Lankan time

    const matchesTodayFilter =
      !todayFilter ||
      (createdTime >= new Date().setHours(0, 0, 0, 0) &&
        createdTime <= new Date().setHours(23, 59, 59, 999));

    return matchesSearchTerm && matchesStatus && matchesTodayFilter;
  });

  const groupedData = filteredData.reduce((acc, user) => {
    const email = user.email;
    if (!acc[email]) {
      acc[email] = {
        key: email,
        email,
        sessionCount: 0,
        sessions: [],
      };
    }
    acc[email].sessionCount += 1;
    acc[email].sessions.push({
      key: user.userSID,
      sessionID: user.sessionID,
      createdTime: new Date(
        new Date(user.createdTime).getTime() + 5.5 * 60 * 60 * 1000
      ).toLocaleString("en-US", {
        timeZone: "Asia/Colombo",
      }),
      duration: user.deActivatedTime
        ? `${Math.floor(
            (new Date(user.deActivatedTime) - new Date(user.activatedTime)) /
              60000
          )} mins`
        : "N/A",
      session_status: user.session_status,
    });
    return acc;
  }, {});

  const tableData = Object.values(groupedData);

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="User Sessions"
              extra={
                <>
                  <Radio.Group
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      fetchData();
                    }}
                    defaultValue="all"
                  >
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="active">Active</Radio.Button>
                    <Radio.Button value="deactive">Inactive</Radio.Button>
                    <Radio.Button value="inactive">Not Started</Radio.Button>
                    <Radio.Button value="status">Ticket Status</Radio.Button>
                  </Radio.Group>
                  <input
                    type="text"
                    placeholder={`Search by ${searchColumn}`}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      fetchData();
                    }}
                    className="ml-4 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="flex items-center ml-4">
                    <input
                      type="checkbox"
                      checked={todayFilter}
                      onChange={(e) => {
                        setTodayFilter(e.target.checked);
                        fetchData();
                      }}
                      className="mr-2"
                    />
                    Today's Results
                  </label>
                </>
              }
            >
              <div className="table-responsive">
                {loading ? (
                  <div className="flex justify-center text-center text-blue-300 text-xs">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    expandable={{ expandedRowRender }}
                    dataSource={tableData}
                    pagination={false}
                    className="ant-border-space"
                    scroll={{ y: 400 }} // Make the table scrollable
                  />
                )}
              </div>
              <div className="uploadfile pb-15 shadow-none">
                <Upload {...formProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    Click to Export
                  </Button>
                </Upload>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;
