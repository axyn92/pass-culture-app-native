import React, { useState } from 'react'
import styled from 'styled-components'
import styledNative from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel.web'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { getSpacingString, Spacer, Typo } from 'ui/theme'
import { Li } from 'ui/web/list/Li.web'

type Props = {
  label: string
  placeholder: string
  options: string[] | number[]
}

export function DropDown({ label, placeholder, options }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null)
  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = (value: string | number) => {
    setSelectedOption(value)
    setIsOpen(false)
  }

  const dropDownInputID = uuidv4()

  return (
    <InputContainer>
      <InputLabel htmlFor={dropDownInputID}>{label}</InputLabel>
      <Spacer.Column numberOfSpaces={2} />
      <DropDownButton
        role="button"
        type="button"
        id={dropDownInputID}
        onClick={toggling}
        data-toggle="dropdown"
        onBlur={() => setIsOpen(false)}>
        <SytledBody isSelected={!!selectedOption}>{selectedOption || placeholder}</SytledBody>
      </DropDownButton>
      {!!isOpen && (
        <Ul>
          {options.map((option: string | number) => (
            <Li key={option}>
              <ButtonOption role="button" type="button" onMouseDown={() => onOptionClicked(option)}>
                <Typo.Body>{option}</Typo.Body>
              </ButtonOption>
            </Li>
          ))}
        </Ul>
      )}
    </InputContainer>
  )
}

const Button = styled.button`
  ${({ theme }) => `
    width: 100%;
    padding-right: ${getSpacingString(4)};
    padding-left: ${getSpacingString(4)};
    background-color: ${theme.colors.white};
    text-align: start;
    cursor: pointer;
  `}
`

const DropDownButton = styled(Button)`
  ${({ theme }) => `
    height: ${getSpacingString(10)};
    padding-top: ${getSpacingString(1)};
    padding-bottom: ${getSpacingString(1)};
    border-radius: ${theme.borderRadius.button}px;
    border: solid 1px ${theme.colors.greyMedium};

    &:focus, :active {
      border-color: ${theme.colors.primary};
    }
  `}
`

const SytledBody = styledNative(Typo.Body)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.black : theme.colors.greyDark,
}))

const Ul = styled.ul`
  ${({ theme }) => ` 
    width: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 100%;
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.greyLight};
    border-radius: ${getSpacingString(1)};
    max-height: ${getSpacingString(75)};
    overflow: scroll;
    margin-top: ${getSpacingString(2)};
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
  `}
`

const ButtonOption = styled(Button)`
  ${({ theme }) => `
    width: 100%;
    padding-right: ${getSpacingString(4)};
    padding-left: ${getSpacingString(4)};
    padding-top: ${getSpacingString(2)};
    padding-bottom: ${getSpacingString(2)};
    border: none;

    &:hover {
      background-color: ${theme.colors.greyLight};
    }

    &:focus {
      background-color: ${theme.colors.greyLight};
    }
  `}
`
