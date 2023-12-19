import React from "react";
import { notifications } from "@mantine/notifications";

export const pushNotification = (title, message, status) => {

  if(status == "normal"){
    notifications.show({
        title: title,
        message: message,
        styles: {
          root: {
            backgroundColor: "#fff",
            '&::before': { backgroundColor: "#a648e5" },
          },

          title: { color: "#000", fontFamily: `'kanit', sans-serif`, },
          description: { color: "#000"},
          closeButton: {
            color: "rgba(0, 0, 0, .25)",
            '&:hover': { 
              color: "#fff",
              backgroundColor: "#a648e5",
            },
          },
        },
    })
  }
  else if(status == "error") {
    notifications.show({
      title: title,
      message: message,
      styles: {
        root: {
          backgroundColor: "rgb(255, 51, 0, 0.7)",
          '&::before': { backgroundColor: "#fff" },
        },

        title: { color: "#fff" , fontFamily: `'kanit', sans-serif`, fontWeight: "bold"},
        description: { color: "#fff"},
        closeButton: {
          color: "#fff",
          '&:hover': { 
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, .25)",
          },
        },
      },
    })
  }
}