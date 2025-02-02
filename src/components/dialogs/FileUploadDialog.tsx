import api from "@/api"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { hideLoader, openLoader } from "@/store/features/loaderSlice"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import {
	ChangeEvent,
	DragEvent as ReactDragEvent,
	ReactNode,
	useRef,
	useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Button } from "../ui/button"
import { PDFViewer } from "../viewers"

type FileUploadDialogType = {
	allowedTypes?: string[]
	children: ReactNode
	onFileUpload: (url: string) => void
}

const FileUploadDialog = ({
	allowedTypes = ["image/png", "image/jpeg", "application/pdf"],
	children,
	onFileUpload,
}: FileUploadDialogType) => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const fileInputRef = useRef<HTMLInputElement | null>(null)

	const [isOpen, setIsOpen] = useState(false)
	const [file, setFile] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const { mutate: uploadFileDocument } =
		api.auth.uploadFileDocument.useMutation({
			onMutate: () => {
				dispatch(openLoader())
			},
			onSuccess: (data) => {
				onFileUpload(data.file)
				setIsOpen(false)

				setFile(null)
			},
			onSettled: () => dispatch(hideLoader()),
		})

	const handleSelectFile = () => fileInputRef.current?.click()

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement
		const files = target.files

		if (files) {
			setFile(files[0])
			fileInputRef.current!.value = ""
		}
	}

	const onDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(true)

		event.dataTransfer!.dropEffect = "copy"
	}

	const onDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)
	}

	const onDrop = (event: ReactDragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)

		const files = event.dataTransfer?.files
		if (!files) return

		for (let i = 0; i < files.length; i++) {
			if (files[i].type.split("/")[0] != "image") continue

			setFile(files[0])
		}
	}

	const handleUpload = () => {
		if (file) {
			uploadFileDocument(file)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild onClick={() => setIsOpen(true)}>
				{children}
			</DialogTrigger>
			<DialogContent className="max-w-[90%] sm:max-w-[400px] rounded-lg p-2 py-6 pt-12 bg-white">
				<DialogTitle className="hidden"></DialogTitle>
				<DialogDescription className="hidden"></DialogDescription>

				<div className="flex flex-col items-center gap-4">
					<div
						onDragOver={onDragOver}
						onDragLeave={onDragLeave}
						onDrop={onDrop}
						className={cn(
							"flex justify-center items-center w-11/12 max-w-[400px] sm:w-10/12 aspect-square rounded-xl border-2 border-dashed border-gray-400 relative",
							isDragging ? "border-secondary" : "",
							file?.type.split("/")[0] === "application"
								? "aspect-auto"
								: ""
						)}
					>
						{file ? (
							<>
								<Button
									variant="destructive"
									size="icon"
									className="w-5 h-5 rounded-full absolute top-0 translate-y-[-50%] right-0 translate-x-[50%]"
									onClick={() => setFile(null)}
								>
									<Cross2Icon className="w-3 h-3 font-bold text-white" />
								</Button>

								<div className="min-h-[320px] flex items-center justify-center w-full h-full p-4">
									{file.type === "application/pdf" ? (
										<PDFViewer
											pdfLink={URL.createObjectURL(file)}
											rotatePoint={0}
										/>
									) : (
										<img
											src={URL.createObjectURL(file)}
											alt="Image File"
										/>
									)}
								</div>
							</>
						) : (
							<div className="min-h-[320px] flex flex-col items-center justify-center gap-2">
								<p className="px-1 text-sm text-center">
									{t("upload.select-or-drag-and-drop-here")}
								</p>
								<p className="text-xs text-center px-3 text-[#666]">
									{t("upload.image-pdf-type-less-than-10mb")}
								</p>
								<Button
									variant="outline"
									className="border-secondary text-secondary hover:text-secondary/80 active:text-secondary/80 mt-3"
									onClick={handleSelectFile}
								>
									{t("common.select-file")}
								</Button>
							</div>
						)}
					</div>
					<Button onClick={handleUpload}>{t("common.upload")}</Button>
				</div>
			</DialogContent>

			<input
				ref={fileInputRef}
				type="file"
				accept={allowedTypes.join(", ")}
				onChange={onFileChange}
				className="hidden"
				aria-label="File Selector"
			/>
		</Dialog>
	)
}

export default FileUploadDialog
