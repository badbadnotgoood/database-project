import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { updateModalStatus } from "../../../Store/Actions";

const SendButton = styled.button`
  cursor: pointer;
  margin-top: 10px;
  height: 40px;
  border-radius: 20px;
  font-size: 25px;
  line-height: 25px;
  border: 1px solid gray;
  text-align: center;
  align-items: center;
  background-color: lightblue;
  color: black;
  width: 300px;

  &:hover {
    background-color: blue;
    color: white;
  }
`;

const Textarea = styled.textarea`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid gray;
  align-items: flex-start;
`;

const Input = styled.input`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid gray;
  align-items: flex-start;
`;

const Content = styled.p`
  align-items: flex-start;
`;

const Title = styled.p`
  font-size: 25px;
  font-weight: bolder;
  line-height: 25px;
  border-bottom: 1px solid #e0e0e0;
  align-items: flex-start;
`;

const ReviewContainer = styled.div`
  background-color: white;
  padding: 20px;
  border: 1px solid gray;
  border-radius: 20px;
  width: 900px;
  align-items: flex-start;
  & > * {
    margin-bottom: 10px;
  }

  & *:last-child {
    margin-bottom: unset;
  }
`;

export const Review = ({ currentCardName, updateModalStatus }) => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    axios.get("./api/0.1.0/getUserData").then((r) => {
      const username = r.data.username;
      setUsername(username);
    });
  }, []);

  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRaiting, setReviewRaiting] = useState(0);

  useEffect(() => {
    if (reviewRaiting > 10) {
      setReviewRaiting(10);
    }
  }, [reviewRaiting]);

  return (
    <ReviewContainer>
      <Title>Отзыв</Title>
      <Content>Заголовок</Content>
      <Input
        placeholder="Заголовок отзыва"
        value={reviewTitle}
        onChange={(e) => {
          setReviewTitle(e.target.value);
        }}
      />
      <Content>Текст</Content>
      <Textarea
        placeholder="Текст отзыва"
        value={reviewText}
        onChange={(e) => {
          setReviewText(e.target.value);
        }}
      />
      <Content>Оценка</Content>
      <Input
        type={"number"}
        min={1}
        max={10}
        placeholder="Оценка отзыва"
        value={reviewRaiting}
        onChange={(e) => {
          setReviewRaiting(e.target.value);
        }}
      />
      <SendButton
        onClick={() => {
          axios
            .post("./api/0.1.0/sendReview", {
              login: username,
              title: reviewTitle,
              text: reviewText,
              raiting: reviewRaiting,
              rest_name: currentCardName.name,
            })
            .then((r) => {
                if (r.data.status === 1) {
                    updateModalStatus(2)
                }
            });
        }}
      >
        Оставить отзыв
      </SendButton>
    </ReviewContainer>
  );
};

const mapStateToProps = (state) => ({
  currentCardName: state.currentCardName,
});

const mapDispatchToProps = {updateModalStatus};

export default connect(mapStateToProps, mapDispatchToProps)(Review);
