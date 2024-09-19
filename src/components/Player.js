import React, { useEffect, useState } from "react";
import "./index.css";
import mode from "../assets/mode.png";
import next from "../assets/next.png";
import homeicon from "../assets/homeicon.png";
import logo from "../assets/logo.png";
import newselection from "../assets/audio/selectplayer.mp3";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { interactCall } from "../services/callTelemetryIntract";
import jwt from "jwt-decode";
import { usePlayers } from "../utility/helperHook";

function Player() {
  const { Player1, Player2 } = usePlayers();
  const [current, setCurrent] = useState("");
  const [currentUserLogin,setIsCurrentUserLogin] = useState(!!localStorage.getItem('token'))
  const [isBuddyLogin,setIsBuddyLogin] = useState(!!localStorage.getItem('buddyToken'))

  function setPlayers(item) {
    setCurrent(item);
    localStorage.setItem("players", item);
    let playerClicked = new Audio(newselection);
    playerClicked.play();
  }

  return (
    <div className="main-container">
      <div className="top-header">
        <img
          src={logo}
          className="storyling-logo"
          alt="logo"
        />
        <Link to="/">
          <img
            src={homeicon}
            height="25px"
            alt="homeicon"
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>
      <div>
        <img
          src={mode}
          height="70px"
          alt="story"
          style={
            window.screen.width > 767
              ? { marginTop: "20px" }
              : { marginTop: "60px" }
          }
        />
      </div>
      {
        currentUserLogin?  <div className="player-container">
        <>
          <p
            onClick={() => {
              interactCall("setPlayer_p1", "player", "DT", "");
              setPlayers("p1s");
            }}
            className={
              current === "p1s" ? "no_Of_Player_Selected" : "no_Of_Player"
            }
          >
            {Player1 === "" ? "1 Player" : Player1.student_name}
          </p>
        </>
        { isBuddyLogin ? (
          <>
            <p
              onClick={() => {
                interactCall("BuddyPlayer_p2", "player", "DT", "");
                setPlayers("p2s");
              }}
              className={
                current === "p2s" ? "no_Of_Player_Selected" : "no_Of_Player"
              }
            >
              {Player2 === "" ? "2 Player" : Player2.student_name}
            </p>
          </>
        ) : (
          ""
        )}
      </div> :  <div className="player-container">
        <>
          <p
            onClick={() => {
              interactCall("BuddyPlayer_p1", "player", "DT", "");
              setPlayers("p1s");
            }}
            className={
              current === "p1s" ||  current === "p2s" ? "no_Of_Player_Selected" : "no_Of_Player"
            }
          >
            {Player1 === "" ? "1 Player" : Player1.student_name}
          </p>
        </>

          <>
            <p
              onClick={() => {
                interactCall("setPlayer_p2", "player", "DT", "");
                setPlayers("p2s");
              }}
              className={
                current === "p2s" ? "no_Of_Player_Selected" : "no_Of_Player"
              }
            >
              {Player2 === "" ? "2 Player" : Player2.student_name}
            </p>
          </>
      </div>
      }
      <div className="footerNext">
        <Link to="/avatar">
          <img
            src={next}
            height="30px"
            alt="player2"
            style={
              current
                ? { cursor: "pointer" }
                : { opacity: 0.3, pointerEvents: "none" }
            }
            onClick={() => {
              interactCall("avatar", "player", "DT", "");
              setPlayers(current);
              localStorage.setItem("score1", 0);
              localStorage.setItem("score2", 0);
            }}
          />
        </Link>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Player;
