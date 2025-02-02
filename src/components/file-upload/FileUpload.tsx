import api from "@/api";
import { cn } from "@/lib/utils";
import { hideLoader, openLoader } from "@/store/features/loaderSlice";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
  ChangeEvent,
  DragEvent as ReactDragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { PDFViewer } from "../viewers";
import { UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type FileUploadType = {
  allowedTypes?: string[];
  onFileUpload: (url: string) => void;
  fileUrl?: string;
  setFileUrl?: (url: string) => void;
};

const FileUpload = ({
  allowedTypes = ["image/png", "image/jpeg", "application/pdf"],
  onFileUpload,
  fileUrl,
  setFileUrl,
}: FileUploadType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<string | undefined>(undefined);

  function getFileType(url: string): string | undefined {
    const extension = url.split(".").pop()?.toLowerCase();

    const fileTypes: Record<string, string> = {
      pdf: "application/pdf",
      mp4: "video/mp4",
      jpeg: "image/jpeg",
      png: "image/png",
    };

    return extension ? fileTypes[extension] : undefined;
  }

  const getFileMetadata = async (url: string) => {
    try {
      const fileName = url.split("/")?.pop()?.split("?")[0];
      const response = await fetch(url, { method: "HEAD" });
      const size = response.headers.get("content-length");

      return {
        name: fileName,
        size: size
          ? (parseInt(size, 10) / 1024 / 1024).toFixed(2) + " MB"
          : "Unknown size",
      };
    } catch (error) {
      console.error("Error fetching file metadata:", error);
      return { name: "Unknown name", size: "Unknown size" };
    }
  };

  useEffect(() => {
    async function refetchFile() {
      try {
        if (fileUrl) {
          console.log("Fetching metadata for file:", fileUrl);
          const { name, size } = await getFileMetadata(fileUrl);
          setFileName(name);
          setFileSize(size);
        }
      } catch (error) {
        console.error("Error fetching file metadata:", error);
      }
    }

    refetchFile();
  }, [fileUrl]);

  useEffect(() => {
    if (file) {
      uploadFileDocument(file);
    }
  }, [file]);

  const { mutate: uploadFileDocument } =
    api.auth.uploadFileDocument.useMutation({
      onMutate: () => {
        dispatch(openLoader());
      },
      onSuccess: (data) => {
        onFileUpload(data.file);

        setFile(null);
      },
      onSettled: () => dispatch(hideLoader()),
    });

  const handleSelectFile = () => fileInputRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      setFile(files[0]);
      fileInputRef.current!.value = "";
    }
  };

  const onDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);

    event.dataTransfer!.dropEffect = "copy";
  };

  const onDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] != "image") continue;

      setFile(files[0]);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full items-center gap-4 w-full">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "w-full h-full flex justify-center items-center max-w-[400px] rounded-xl border relative bg-[#F4F6F9]",
            isDragging ? "border-secondary" : "",
            file?.type.split("/")[0] === "application" ? "aspect-auto" : ""
          )}
        >
          {fileUrl ? (
            <>
              <Button
                type="button"
                size="icon"
                className="absolute top-0.5 right-0.5 p-1"
                onClick={() => {
                  if (setFileUrl) {
                    setFileUrl('');
                  }
                }}
                variant={"ghost"}
              >
                <Cross1Icon />
              </Button>

              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                {getFileType(fileUrl) === "application/pdf" ? (
                  <PDFViewer pdfLink={fileUrl} rotatePoint={0} />
                ) : getFileType(fileUrl) === "video/mp4" ? (
                  <>
                    {/* <PlayVideoIcon width="50" height="50" /> */}
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <span>
                        {fileName && fileName.length > 15
                          ? `${fileName.slice(0, 14)}...${fileName
                              .split(".")
                              .pop()}`
                          : fileName}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="link"
                            className="text-secondary p-0 text-xs"
                          >
                            {t("common.preview")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-white">
                          <DialogHeader>
                            <DialogTitle>{t("common.preview")}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2">
                              {fileName} | {fileSize}
                            </DialogDescription>
                          </DialogHeader>
                          <div>
                            <video src={fileUrl} controls />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button">{t("common.close")}</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <span className="mr-1 text-xs">{fileSize}</span>
                    </div>
                  </>
                ) : (
                  <img
                    src={fileUrl}
                    alt="Image File"
                    className="object-contain w-full h-full"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="min-h-[320px] flex flex-col items-center justify-center gap-2">
              <UploadCloud
                color="#666"
                className="w-40 h-20"
                strokeWidth={"1"}
              />
              <p className="px-1 text-sm text-center">
                {t("upload.select-or-drag-and-drop-here")}
              </p>
              <p className="text-xs text-center px-3 text-[#666]">
                {t("upload.image-pdf-type-less-than-10mb")}
              </p>
              <Button
                type="button"
                variant="outline"
                className="border-secondary text-secondary hover:text-secondary/80 active:text-secondary/80 mt-3"
                onClick={handleSelectFile}
              >
                {t("common.select-file")}
              </Button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(", ")}
        onChange={onFileChange}
        className="hidden"
        aria-label="File Selector"
      />
    </>
  );
};

export default FileUpload;
