import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { updateModalStatus } from "../../../Store/Actions";

const Error = styled.p`
  color: red;
  font-size: 15px;
  margin-top: 10px;
  align-items: flex-start;
`;

const RegisterButton = styled.button`
  font-size: 15px;
  margin-top: 10px;
  align-items: flex-start;
  color: gray;
  cursor: pointer;
  &:hover {
    color: #960000;
  }
`;

const Button = styled.button`
  height: 40px;
  color: blue;
  border: 1px solid blue;
  border-radius: 20px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: #960000;
    border: 1px solid #960000;
  }

  & > * {
    width: max-content;
  }
`;

const Star = styled.span`
  color: red;
`;

const Description = styled.p`
  font-size: 15px;
  color: gray;
  align-items: flex-start;
`;

const Input = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  width: 300px;
`;

const SubTitle = styled.p`
  width: max-content;
  font-size: 18px;
  flex-direction: row;
  white-space: nowrap;
  &::last-letter {
    color: red;
  }
`;

const InputContainer = styled.div`
  margin-top: 10px;
  align-items: flex-start;
  width: max-content;

  & > * {
    margin-bottom: 5px;
  }

  & > *:last-child {
    margin-bottom: unset;
  }
`;

const Title = styled.p`
  font-size: 20px;
  height: 35px;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
`;

const AuthContainer = styled.div`
  padding: 10px 20px 20px 20px;
  border: 1px solid gray;
  border-radius: 30px;
  width: max-content;
  height: max-content;
  align-items: center;
  background-color: white;
`;

const Register = ({ authStatus, updateModalStatus }) => {
  const [status, setStatus] = useState(0);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState(false);

  return status === 0 ? (
    <AuthContainer>
      <Title>??????????????????????</Title>
      <InputContainer>
        <SubTitle>
          ?????? ???????????????????????? <Star>*</Star>
        </SubTitle>
        <Input
          onChange={(e) => {
            setLogin(e.target.value);
          }}
          value={login}
        />
      </InputContainer>
      <InputContainer>
        <SubTitle>
          ???????????? <Star>*</Star>
        </SubTitle>
        <Input
          type={"password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
      </InputContainer>
      {error && <Error>?????????????????????? ???????????? ?????????? ?????? ????????????.</Error>}
      <RegisterButton
        onClick={() => {
          setStatus(1);
          setLogin("");
          setPassword("");
        }}
      >
        ?????????????? ?? ??????????????????????
      </RegisterButton>
      <Button
        onClick={() => {
          const data = {
            login: login,
            password: password,
          };
          axios.post("/api/0.1.0/authUser", data).then((r) => {
            if (r.data.status === 1) {
              updateModalStatus(0);
            } else {
              setError(true);
              setPassword("")
            }
          });
        }}
      >
        ??????????
      </Button>
    </AuthContainer>
  ) : (
    <AuthContainer>
      <Title>??????????????????????</Title>
      <InputContainer>
        <SubTitle>
          ?????? ???????????????????????? <Star>*</Star>
        </SubTitle>
        <Input
          onChange={(e) => {
            setLogin(e.target.value);
          }}
          value={login}
        />
        <Description>???????????????????????? ????????.</Description>
      </InputContainer>
      <InputContainer>
        <SubTitle>
          Email <Star>*</Star>
        </SubTitle>
        <Input
          type={"email"}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <Description>???????????????????????? ????????.</Description>
      </InputContainer>
      <InputContainer>
        <SubTitle>
          ???????????? <Star>*</Star>
        </SubTitle>
        <Input
          type={"password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <Description>???????????????????????? ????????.</Description>
      </InputContainer>
      {error && <Error>?????????????????????? ???????????? ?????????? ?????? ????????????.</Error>}
      <RegisterButton
        onClick={() => {
          setStatus(0);
          setLogin("");
          setPassword("");
          setEmail("");
        }}
      >
        ?????????????? ?? ??????????????????????
      </RegisterButton>
      <Button
        onClick={() => {
          const data = {
            login: login,
            email: email,
            password: password,
          };
          axios.post("/api/0.1.0/registerUser", data).then((r) => {
            if (r.data.status === 1) {
              updateModalStatus(3);
            } else {
              setError(true);
            }
          });
        }}
      >
        ????????????????????????????????????
      </Button>
    </AuthContainer>
  );
};

const mapStateToProps = (state) => ({
  authStatus: state.authStatus,
});

const mapDispatchToProps = {updateModalStatus};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
