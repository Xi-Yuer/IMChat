package dto

type FileResposeDTO struct {
	ID         string `json:"id"`
	FileType   string `json:"file_type"`
	FileName   string `json:"file_name"`
	FileUrl    string `json:"file_url"`
	FileSize   int64  `json:"file_size"`
	FileSender string `json:"file_sender"`
}
