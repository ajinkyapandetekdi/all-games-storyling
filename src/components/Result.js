import React, { useEffect, useState } from "react";
import p1win from "../assets/p1win.png";
import p2win from "../assets/p2win.png";
import draw from "../assets/draw.png";
import home from "../assets/home.png";
import trophy from "../assets/trophy2.png";
import win from "../assets/audio/win.mp3";
import homeicon from "../assets/homeicon.png";
import over from "../assets/over.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { usePlayers } from "../utility/helperHook";

const players = {
  p1: "ps1",
  p2: "ps2",
  p3: "ps3",
  p4: "ps4",
};
const Snowflake = (props) => {
  return (
    <p className="Snowflake" id={`item${props.id}`} style={props.style}>
      *
    </p>
  );
};

function Result() {
  const { Player1, Player2 } = usePlayers();
  let player1 = localStorage.getItem("p1");
  let player2 = localStorage.getItem("p2");
  let score1 = localStorage.getItem("score1");
  let score2 = localStorage.getItem("score2");
  let numberOfPlayers = localStorage.getItem('players');

  useEffect(()=>{
    if(!!localStorage.getItem('buddyToken')){
      send(localStorage.getItem("score1"),localStorage.getItem("score2"))
    }
    else{
      send(localStorage.getItem("score1"))
    }
  },[])

  const send = (score1,score2) => {
    if(!!localStorage.getItem('buddyToken')){
      const Player1 = (score1 / 100).toPrecision(2);
      const Player2 = (score2 / 100).toPrecision(2);
      if (window && window.parent) {
        window.parent.postMessage({
          score1: Player1,
          score2: Player2,
          message: 'storylingo-app-score',
        });
      }
    }
    else{
      const Player1 = (score1 / 100).toPrecision(2);
      if (window && window.parent) {
        window.parent.postMessage({
          score1: Player1,
          message: 'storylingo-app-score',
        });
      }
    }
    window.telemetry?.syncEvents && window.telemetry.syncEvents();
  };


  function snow() {
    let animationDelay = "0s";
    let fontSize = "100px";
    let arr = Array.from(
      "Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!! Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!! Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!!"
    );
    return arr.map((el, i) => {
      animationDelay = `${(Math.random() * 16).toFixed(2)}s`;
      fontSize = `${Math.floor(Math.random() * 10) + 10}px`;
      let style = {
        animationDelay,
        fontSize,
      };
      return <Snowflake key={i} id={i} style={style} />;
    });
  }
  useEffect(() => {
    let winEffect = new Audio(win);
    winEffect.play();
  }, []);
  return (
    <div className="main-container">
      <div className="snow-container">{snow()}</div>
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
      <div
        style={
          window.screen.width > 767
            ? { marginTop: "20px" }
            : { marginTop: "50px" }
        }
      >
        {numberOfPlayers === "p1s" ? (
          <h1 className="mint">GAME OVER</h1>
        ) : Number(score1) > Number(score2) ? (
          <h1 className="mint">{Player1.student_name || "Player 1"} WON</h1>
        ) : Number(score1) === Number(score2) ? (
          <h1 className="mint">DRAW</h1>
        ) : (
          <h1 className="mint">{Player2.student_name || "Player 2"} WON</h1>
        )}

        <img
          src={trophy}
          style={{ marginLeft: "20px" }}
          height="60px"
          alt="trophy"
        />
      </div>
      <div className="flex">
        <div className="grid-item">
          <div>
            <img
              height="150px"
              width="auto"
              style={{ borderRadius: "24px 24px 0 0" }}
              src={require(`../assets/${players[player1]}.png`)}
              alt={"p1"}
            />
          </div>
          <div className="title">
            <p
              style={{
                marginTop: "5px",
                color: "yellow",
                fontFamily: "fantasy",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {Player1.student_name || "Player 1"}
            </p>
          </div>
        </div>
        {numberOfPlayers !== "p1s" && (
          <div className="grid-item">
            <div>
              <img
                height="150px"
                width="auto"
                style={{ borderRadius: "24px 24px 0 0" }}
                src={require(`../assets/${players[player2]}.png`)}
                alt={"ps2"}
              />
            </div>
            <div className="title">
              <p
                style={{
                  marginTop: "5px",
                  color: "yellow",
                  fontFamily: "fantasy",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                 {Player2.student_name || "Player 2"}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex">
        <div className="">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className="coin"
              src={require(`../assets/coin.png`)}
              alt={"coin"}
            />
            <img
              className="total-coin-heading"
              src={require(`../assets/total.png`)}
              alt={"total"}
            />
          </div>
          <div className="coins">{score1}</div>
        </div>
        {numberOfPlayers !== "p1s" && (
          <div className="">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                className="coin"
                src={require(`../assets/coin.png`)}
                alt={"coin"}
              />
              <img
                className="total-coin-heading"
                src={require(`../assets/total.png`)}
                alt={"total"}
              />
            </div>
            <div className="coins">{score2}</div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="btn-result" style={{ right: 0 }}>
          <img height="30px" width="auto" src={home} alt={"home"} />
        </div>
      </Link>
    </div>
  );
}

export default Result;
