"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import { Typography, Card, CardContent, Box } from "@mui/material";
import {
  PersonAdd,
  Assessment,
  FavoriteOutlined,
  BookmarkBorder,
  School,
  Work,
} from "@mui/icons-material";
import { TimelineEvent, TimelineEventType } from "@/types";

interface ParticipantTimelineProps {
  events: TimelineEvent[];
}
export const getEventIcon = (type: TimelineEventType) => {
  switch (type) {
    case TimelineEventType.ENROLLMENT:
      return <PersonAdd />;
    case TimelineEventType.EVALUATION:
      return <Assessment />;
    case TimelineEventType.INTEREST:
      return <FavoriteOutlined />;
    case TimelineEventType.RESERVATION:
      return <BookmarkBorder />;
    case TimelineEventType.GRADUATION:
      return <School />;
    case TimelineEventType.HIRING:
      return <Work />;
    default:
      return <PersonAdd />;
  }
};

const getEventColor = (type: TimelineEventType) => {
  switch (type) {
    case TimelineEventType.ENROLLMENT:
      return "#1976d2";
    case TimelineEventType.EVALUATION:
      return "#2e7d32";
    case TimelineEventType.INTEREST:
      return "#ed6c02";
    case TimelineEventType.RESERVATION:
      return "#9c27b0";
    case TimelineEventType.GRADUATION:
      return "#0288d1";
    case TimelineEventType.HIRING:
      return "#d32f2f";
    default:
      return "#666";
  }
};

const ParticipantTimeline: React.FC<ParticipantTimelineProps> = ({
  events,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (!events.length) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Nenhum evento registrado
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Timeline de Eventos
        </Typography>
        <Timeline position="alternate">
          {events.map((event, index) => (
            <TimelineItem key={event.id}>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align={index % 2 === 0 ? "right" : "left"}
                variant="body2"
                color="text.secondary"
              >
                {formatDate(event.date)}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: getEventColor(event.type),
                    color: "white",
                  }}
                >
                  {getEventIcon(event.type)}
                </TimelineDot>
                {index < events.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                {event.actorName && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, fontStyle: "italic" }}
                  >
                    Por: {event.actorName}
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};
export default ParticipantTimeline;
