export const reasonFormatter = (passage?: string): string[] => {
	if (!passage) return []

	const lines = passage.split(/(?<=\.\s|\.\n|\.\[|\.\])(?=\s*[A-Z])/)

	return lines.map((line) => line.trim()).filter((line) => line.length > 0)
}

export async function fetchFileFromURL(url: string) {
	try {
		const response = await fetch(url)

		const fileBlob = await response.blob()
		const contentType = response.headers.get("Content-Type")
		const filename = url.split("/").pop() || "downloaded-file.mp4"
		const file = new File([fileBlob], filename, { type: contentType! })

		return file
	} catch (error) {
		console.error("Error fetching file type:", error)
	}
}
