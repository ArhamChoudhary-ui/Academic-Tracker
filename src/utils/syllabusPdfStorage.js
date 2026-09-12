const SYLLABUS_PDF_KEY = "academic_tracker_syllabus_pdfs";

export const saveSyllabusPdf = async (subject, file) => {
  try {
    const data = loadSyllabusPdfs();

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        try {
          data[subject] = {
            fileName: file.name,
            fileData: e.target.result,
            uploadDate: new Date().toISOString(),
            fileSize: file.size,
          };
          localStorage.setItem(SYLLABUS_PDF_KEY, JSON.stringify(data));
          resolve(true);
        } catch (error) {
          reject(false);
        }
      };
      reader.onerror = () => {
        reject(false);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    return false;
  }
};

export const loadSyllabusPdfs = () => {
  try {
    const data = localStorage.getItem(SYLLABUS_PDF_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
};

export const removeSyllabusPdf = (subject) => {
  try {
    const data = loadSyllabusPdfs();
    delete data[subject];
    localStorage.setItem(SYLLABUS_PDF_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
};

export const getSyllabusPdf = (subject) => {
  try {
    const data = loadSyllabusPdfs();
    return data[subject] || null;
  } catch (error) {
    return null;
  }
};

export const clearAllPdfs = () => {
  try {
    localStorage.removeItem(SYLLABUS_PDF_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const getStorageSize = () => {
  try {
    const data = localStorage.getItem(SYLLABUS_PDF_KEY);
    if (!data) return 0;
    return new Blob([data]).size;
  } catch (error) {
    return 0;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
