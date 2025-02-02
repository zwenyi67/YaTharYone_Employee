import { t } from "i18next"
import { QRCodeSVG } from "qrcode.react"
import CopyButton from "../button-with-functions/CopyButton"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

type QrCodeType = {
	qrCodeLink: string
	generateQRFn: () => void
}

const QrCodeBox = ({ qrCodeLink, generateQRFn }: QrCodeType) => {
	return (
		<section className="space-y-4">
			{qrCodeLink ? (
				<div className="relative w-3/4 max-w-[190px] mx-auto text-[10px]">
					<span className="absolute top-0 left-[50%] -translate-x-[50%]">
						QRINTERVIEW
					</span>

					<div className="aspect-square qr-code-corner-outline flex items-center justify-center">
						<QRCodeSVG value={qrCodeLink} />
					</div>

					<span className="absolute bottom-0 left-[50%] -translate-x-[50%]">
						CRID : 123412341234
					</span>
				</div>
			) : (
				<div className="relative w-3/4 qr-code-corner-outline max-w-[190px] mx-auto text-[10px]">
					<div className="aspect-square relative flex items-center justify-center">
						<QRCodeSVG value={qrCodeLink} />
						<div className="bg-white/75 absolute top-0 left-0 flex items-center justify-center w-full h-full"></div>
					</div>

					<Button
						type="button"
						variant="secondary"
						className="top-1/2 left-1/2 hover:bg-black active:bg-black absolute -translate-x-1/2 -translate-y-1/2 bg-black"
						onClick={generateQRFn}
					>
						{t("common.create-qr")}
					</Button>
				</div>
			)}

			<div className="flex items-center gap-3">
				<Label className="text-nowrap">{t("fields.link")} : </Label>

				<div className="relative w-full">
					<Input
						type="text"
						value={qrCodeLink}
						readOnly
						className="disabled:cursor-auto grow pr-9 w-full text-xs"
					/>

					<CopyButton
						text={qrCodeLink}
						className="absolute top-0 right-0"
					/>
				</div>
			</div>
		</section>
	)
}

export default QrCodeBox
