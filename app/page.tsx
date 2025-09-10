// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import "./page.css";
import Image from "next/image";

interface Schedule {
  day: string;
  time: string;
  location: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/scrape");
        const data = await response.json();

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.tableContent, "text/html");
        const rows = doc.querySelectorAll("tbody tr");

        const schedules: Schedule[] = Array.from(rows).map((row) => {
          const cells = Array.from(row.getElementsByTagName("td"));
          return {
            day: cells[0]?.textContent?.trim() || "",
            time: cells[1]?.textContent?.trim() || "",
            location: cells[2]?.textContent?.trim() || "",
          };
        });

        setScheduleData(schedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSchedules = scheduleData.filter((schedule) =>
    Object.values(schedule).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return null;

  return (
    <div className="page">
      <header>
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />

        <a href="https://github.com/astrit" className="author">
          <Image
            src="https://github.com/astrit.png"
            width={24}
            height={24}
            alt="@astrit"
            unoptimized
          />
          <div className="span">Astrit</div>
        </a>
      </header>

      <div className="list">
        {filteredSchedules.map((schedule, index) => (
          <div key={index} className="item">
            <div className="part day">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{schedule.day}</span>
            </div>
            <div className="part time">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{schedule.time}</span>
            </div>
            <div className="part place">
              <svg viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{schedule.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
