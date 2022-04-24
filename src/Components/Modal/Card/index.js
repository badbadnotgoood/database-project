import axios from "axios";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  clearCurrentCardData,
  clearCurrentCardName,
  updateCurrentCardData,
  updateCurrentCardName,
  updateModalStatus,
} from "../../../Store/Actions";

const NewReviewButton = styled.button`
  font-size: 20px;
  line-height: 20px;
  height: 50px;
  border-radius: 20px;
  border: 1px solid blue;
  background-color: greenyellow;
  cursor: pointer;

  &:hover {
    color: chocolate;
  }
`;

const NearRestMetro = styled.p`
  align-items: flex-start;
  font-size: 18px;
  line-height: 20px;
  font-weight: 500;
`;

const NearRestName = styled.p`
  font-size: 18px;
  line-height: 20px;
  font-weight: 600;
  align-items: flex-start;
`;

const NearRestContainer = styled.div`
  flex-direction: row;
  cursor: pointer;
  &:hover {
      color: #960000;
  }
`;

const NearTitle = styled.p`
  font-size: 22px;
  line-height: 25px;
  font-weight: bolder;
  align-items: flex-start;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const RaitingAuthor = styled.p`
  align-items: flex-start;
  white-space: nowrap;
`;

const RaitingScore = styled.p`
  align-items: flex-end;
`;

const RaitingContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const ReviewContent = styled.p`
  font-size: 15px;
  line-height: 15px;
  align-items: flex-start;
`;

const ReviewTitle = styled.p`
  font-size: 18px;
  line-height: 20px;
  font-weight: bold;
  align-items: flex-start;
  margin-bottom: 2.5px;
`;

const ReviewContainer = styled.div`
  align-items: flex-start;
  padding: 10px;
  border-radius: 15px;
  border: 1px solid gray;
  background-color: #e2e2e2;
`;

const ContentText = styled.p`
  font-size: 18px;
  line-height: 20px;
  align-items: flex-start;
`;

const ContentTitle = styled.p`
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  align-items: flex-start;
`;

const Content = styled.div`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.p`
  font-size: 25px;
  line-height: 25px;
  margin-bottom: 5px;
  font-weight: bolder;
  white-space: nowrap;
`;

const RightContainer = styled.div`
  & > div {
    margin-bottom: 10px;
  }

  & > div:last-child {
    margin-bottom: unset;
  }
`;

const LeftContainer = styled.div`
  & > * {
    align-items: flex-start;
  }
`;

const BottomContainer = styled.div`
  width: 50%;
  align-self: flex-start;

  & > div {
    margin-bottom: 5px;
  }

  & > div:last-child {
    margin-bottom: unset;
  }
`;

const TopContainer = styled.div`
  flex-direction: row;

  & > div {
    width: 50%;
    height: 100%;
    justify-content: flex-start;
  }
`;

const CardContainer = styled.div`
  background-color: white;
  padding: 10px 20px 20px 20px;
  border: 1px solid gray;
  border-radius: 30px;
  width: 900px;
`;

const Card = ({
  currentCardName,
  currentCardData,
  updateCurrentCardData,
  updateModalStatus,
  clearCurrentCardName,
  clearCurrentCardData,
  updateCurrentCardName,
}) => {
  useEffect(() => {
    updateCurrentCardData(currentCardName.name, currentCardName.metro);
  }, [currentCardName, updateCurrentCardData]);

  return (
    currentCardData && (
      <CardContainer>
        <TopContainer>
          {currentCardData.info !== null && (
            <LeftContainer>
              <Title>{currentCardData.info.name}</Title>
              <Content>
                <ContentTitle>Кухня: </ContentTitle>
                <ContentText>{currentCardData.info.kitchen}</ContentText>
              </Content>
              <Content>
                <ContentTitle>Диета: </ContentTitle>
                <ContentText>{currentCardData.info.diet}</ContentText>
              </Content>
              <Content>
                <ContentTitle>Ценовая категория: </ContentTitle>
                <ContentText>{currentCardData.info.price}</ContentText>
              </Content>
              <Content>
                <ContentTitle>Метро: </ContentTitle>
                <ContentText>{currentCardData.info.metro}</ContentText>
              </Content>
              {currentCardData.info.phone !== null && (
                <Content>
                  <ContentTitle>Телефон:</ContentTitle>
                  <ContentText>{currentCardData.info.phone}</ContentText>
                </Content>
              )}
            </LeftContainer>
          )}
          {currentCardData.reviews !== null && (
            <RightContainer>
              {currentCardData.reviews.map((el, i) => (
                <ReviewContainer key={"review-" + i}>
                  <ReviewTitle>{el.title}</ReviewTitle>
                  <ReviewContent>{el.content}</ReviewContent>
                  <RaitingContainer>
                    <RaitingAuthor>{"Автор: " + el.username}</RaitingAuthor>
                    <RaitingScore>{"Оценка: " + el.raiting}</RaitingScore>
                  </RaitingContainer>
                </ReviewContainer>
              ))}
              <NewReviewButton
                onClick={() => {
                  axios.get("/api/0.1.0/checkAuth").then((r) => {
                    const status = r.data.status;
                    if (status === 1) {
                      updateModalStatus(3);
                    } else {
                      updateModalStatus(1);
                    }
                  });
                }}
              >
                Оставить отзыв
              </NewReviewButton>
            </RightContainer>
          )}
        </TopContainer>
        <BottomContainer>
          <NearTitle>Рестораны рядом</NearTitle>
          {currentCardData.near !== null &&
            currentCardData.near.map((el, i) => (
              <NearRestContainer
                key={"near-rest-" + i}
                onClick={() => {
                  clearCurrentCardName();
                  clearCurrentCardData();
                  updateCurrentCardName({ metro: el.metro, name: el.name });
                  updateModalStatus(2);
                }}
              >
                <NearRestName>{el.name}</NearRestName>
                <NearRestMetro>{el.metro}</NearRestMetro>
              </NearRestContainer>
            ))}
        </BottomContainer>
      </CardContainer>
    )
  );
};

const mapStateToProps = (state) => ({
  currentCard: state.currentCard,
  currentCardName: state.currentCardName,
  currentCardData: state.currentCardData,
});

const mapDispatchToProps = {
  updateCurrentCardData,
  updateModalStatus,
  clearCurrentCardName,
  clearCurrentCardData,
  updateCurrentCardName,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
