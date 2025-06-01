import React from "react";
import { APP_VERSION } from "../../../config/AppVersion";
import "./Version.css";

const Version = ({ color = "black" }) => {

  return (
    <p className="version">
      Versão: {APP_VERSION}
    </p>
  );
};

export default Version;
