import React from 'react';
import styled from "@emotion/styled";

const CardSyled = styled.div`
  width: fit-content;
  height: fit-content;
  background-color: white;
  display: flex;
  align-items: start;
  flex-direction: column;
  padding: 25px 25px;
  margin: 16px 24px;
  gap: 12px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.055);
`;

const TitleStyled = styled.span`
    font-size: 18px;
    font-weight: 600;
`;

const DescriptionStyled = styled.p`
    font-size: 14px;
`;

const Card = ({title, description}) => {
    return (
        <CardSyled>
            <TitleStyled>
                {title}
            </TitleStyled>   
            <DescriptionStyled>
                {description}
            </DescriptionStyled>
        </CardSyled>
    );
}

export default Card;
