import { t } from '@lingui/macro'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { DropDown } from 'features/auth/signup/SetBirthday/atoms/DropDown/DropDown'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { SignupData } from 'features/auth/signup/types'
import {
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNames,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { formatDateToISOStringWithoutTime, pad } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
}

const MINIMUM_DATE = 1900

type InitialDateProps = {
  day?: number
  month?: string
  year?: number
}

const INITIAL_DATE: InitialDateProps = {
  day: undefined,
  month: undefined,
  year: undefined,
}

export function DatePickerDropDown(props: Props) {
  const CURRENT_DATE = new Date()

  const [date, setDate] = useState<InitialDateProps>(INITIAL_DATE)

  const { optionGroups } = useMemo(() => {
    if (date.year === undefined || date.month === undefined) {
      return { optionGroups: INITIAL_DATE }
    }
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth)
    const currentYear = CURRENT_DATE.getFullYear()
    return {
      optionGroups: {
        day: getDatesInMonth(selectedMonthIndex, selectedYear),
        month: monthNames,
        year: getPastYears(MINIMUM_DATE, currentYear),
      },
    }
  }, [date, monthNames, getYears])

  console.log({ date })

  function onPartialDateChange(key: keyof InitialDateProps) {
    return function (value: string) {
      setDate((prevDateValues) => ({ ...prevDateValues, [key]: value }))
    }
  }

  const dateMonth = monthNames.indexOf(date.month) + 1
  const birthdate = `${date.year}-${pad(dateMonth)}-${pad(date.day)}`

  const { isDisabled, errorMessage } = useDatePickerErrorHandler(new Date(birthdate))

  function goToNextStep() {
    const birthdate = formatDateToISOStringWithoutTime(new Date())
    props.goToNextStep({ birthdate })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <Container>
        <DropDownContainer>
          <DropDown
            label="Jour"
            placeholder="JJ"
            options={optionGroups.day.map(String)}
            onChange={onPartialDateChange('day')}
          />
        </DropDownContainer>
        <Spacer.Row numberOfSpaces={2} />
        <DropDownContainer>
          <DropDown
            label="Mois"
            placeholder="MM"
            options={optionGroups.month}
            onChange={onPartialDateChange('month')}
          />
        </DropDownContainer>
        <Spacer.Row numberOfSpaces={2} />
        <DropDownContainer>
          <DropDown
            label="Année"
            placeholder="AAAA"
            options={optionGroups.year.map(String)}
            onChange={onPartialDateChange('year')}
          />
        </DropDownContainer>
      </Container>
      {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={2} />}
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={isDisabled}
        onPress={goToNextStep}
      />
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  width: '100%',
  zIndex: 1,
})

const DropDownContainer = styled.View({
  flex: 1,
})
