import clsx from "clsx";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { WhiteBlock } from "../../WhiteBlock";
import { Button } from "../../Button";
import { StepInfo } from "../../StepInfo";

import styles from "./GitHubStep.module.scss";
import { StepContext, UserData } from "../../../pages";

export const GitHubStep = () => {
  const { onNextStep, setUserData } = React.useContext(StepContext);

  const onClickGitHub = () => {
    window.open(
      "http://localhost:3001/auth/github",
      "Auth",
      "width=400,height=400,status=yes,toolbar=no,menubar=no,location=no"
    );
  };

  useEffect(() => {
    window.addEventListener("message", ({ data }) => {
      const user: string = data;
      if (typeof data === "string" && user.includes("avatarUrl")) {
        Cookies.remove("token");
        const json: UserData = JSON.parse(user);
        setUserData(json);
        onNextStep();
        Cookies.set("token", json.token);
      }
    });
  }, []);
  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/connect.png"
        title="Do you want import info from GitHub?"
      />
      <WhiteBlock className={clsx("m-auto mt-40", styles.whiteBlock)}>
        <Button onClick={onClickGitHub} className={styles.button}>
          Import from GitHub
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
        <div className="link mt-20 cup d-ib">Enter my info manually</div>
      </WhiteBlock>
    </div>
  );
};
