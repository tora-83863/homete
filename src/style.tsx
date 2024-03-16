import { css } from '@emotion/css';

export const colorCode = {
  background: "#edeef4",
  white: "#fafafa",

  // https://palettemaker.com/app
  // Silver Trinket
  accent: "#807166",
  user: "#baa495",
  system: "#c8c6c2",
};

export const header = css`
  padding: 15px;
  background-color: ${colorCode.accent};
  color: ${colorCode.white};
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

export const chatContainer = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colorCode.background};
  margin-bottom: 50px;
`;

export const chatArea = css`
  flex-wrap: wrap;
  margin: 15px 35px;
`;

export const image = css`
  width: 100%;
`;

const fukidasi = css`
  width: fit-content;
  max-width: 90%;
  position: relative;
  padding: 20px;
  margin-bottom: 15px;
  font-size: 16px;
  border-radius: 12px;
  box-sizing: border-box;
  word-break: break-all;
  &:before {
    content: "";
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-radius: 50%;
    transform: rotate(45deg);
    top: 22px;
    border-right: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }
  &:after {
    content: "";
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-radius: 50%;
    transform: rotate(45deg);
    top: 40px;
    border-right: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }
`;

export const fukidasiUser = css`
  ${fukidasi}
  margin-right: 0;
  margin-left: auto;
  background-color: ${colorCode.user};
  &:before {
    left: auto;
    right: -15px;
    border-left: 25px solid transparent;
    border-top: 25px solid ${colorCode.user};
  }
  &:after {
    left: auto;
    right: -25px;
    border-left: 27px solid transparent;
    border-top: 25px solid ${colorCode.background};
  }
`;

export const fukidasiSystem = css`
  ${fukidasi}
  background-color: ${colorCode.system};
  &:before {
    left: -15px;
    border-left: 25px solid ${colorCode.system};
    border-top: 25px solid transparent;
  }
  &:after {
    left: -25px;
    border-left: 25px solid ${colorCode.background};
    border-top: 25px solid transparent;
  }
`;

export const inputContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${colorCode.white};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const input = css`
  flex: 1;
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 2px solid ${colorCode.accent};
  border-radius: 4px;
`;
