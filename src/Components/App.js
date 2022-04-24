import React, { useRef } from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import styled from "styled-components";
import {
  clearCurrentCardData,
  clearCurrentCardName,
  updateModalStatus,
} from "../Store/Actions";
import Auth from "./Modal/Auth";
import Card from "./Modal/Card";
import Review from "./Modal/Review";

const ModalContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
`;

const App = ({
  modalStatus,
  updateModalStatus,
  clearCurrentCardData,
  clearCurrentCardName,
}) => {
  const ModalContainerRef = useRef();

  const ModalComponent = (
    <ModalContainer
      ref={ModalContainerRef}
      onClick={(e) => {
        const current = e.target;
        const ref = ModalContainerRef.current;
        if (current === ref) {
          clearCurrentCardName();
          clearCurrentCardData();
          updateModalStatus(0);
        }
      }}
    >
      {modalStatus === 1 && <Auth />}
      {modalStatus === 2 && <Card />}
      {modalStatus === 3 && <Review />}
    </ModalContainer>
  );

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Main />} />
      </Routes>
      {modalStatus !== 0 && ModalComponent}
    </>
  );
};

const mapStateToProps = (state) => ({
  modalStatus: state.modalStatus,
});

const mapDispatchToProps = {
  updateModalStatus,
  clearCurrentCardData,
  clearCurrentCardName,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
