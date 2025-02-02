import { TimeChoiceType } from "./types"

export const QR_BASE_URL =
	"https://lemon-cliff-04dc3e700.5.azurestaticapps.net/apply?PositionId="

const generateTimes = (interval: number) => {
	const times: TimeChoiceType[] = []
	const hours = [...Array(12).keys()]

	for (let meridiem = 0; meridiem < 2; meridiem++) {
		hours.forEach((h) => {
			let minute = 0

			while (minute < 60) {
				const hourValue = (meridiem === 1 ? h + 12 : h)
					.toString()
					.padStart(2, "0")
				const minuteValue = minute.toString().padStart(2, "0")
				const timeValue = `${hourValue}:${minuteValue}`

				const check12 = meridiem === 1 && h === 0 ? 12 : h

				const formattedHr = check12.toString().padStart(2, "0")
				const formattedMin = minute.toString().padStart(2, "0")

				const formattedTime = `${formattedHr}:${formattedMin} ${
					meridiem === 0 ? "am" : "pm"
				}`

				times.push({
					value: timeValue,
					text: formattedTime,
				})

				minute += interval
			}
		})
	}

	return times
}

export const TIMES = generateTimes(30)
