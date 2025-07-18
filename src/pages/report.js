import GetAllReportUseCase from "@/application/usecases/ReportUseCase/GetAllReportUseCase";
import ReportRepo from "@/infraestructure/implementation/httpRequest/axios/ReportRepo";
import React, { useEffect, useState } from "react";

export default function Report() {
  const [report, setReport] = useState([]);

  const reportRepo = new ReportRepo();
  const getAllReportUseCase = new GetAllReportUseCase(reportRepo);

  const fetchReports = async () => {
    const data = {
      start: "2025-07-17",
      end: "2025-07-17",
      servicio: 0,
      idu: 0,
    };

    const response = await getAllReportUseCase.run(
      data.start,
      data.end,
      data.servicio,
      data.idu
    );
    setReport(response);
    console.log("response", response);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ height: "calc(100vh - 82px)" }}>
      <h1>Report</h1>
    </div>
  );
}
