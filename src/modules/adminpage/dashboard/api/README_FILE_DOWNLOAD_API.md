# 파일 다운로드 API 구현 가이드

## 1. 공지사항 파일 다운로드 API

### 엔드포인트
```
GET /api/admin/notices/{noticeId}/download
```

### 구현 예시 (Spring Boot)
```java
@RestController
@RequestMapping("/api/admin/notices")
public class NoticeController {
    
    @GetMapping("/{noticeId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long noticeId) {
        // 1. 공지사항 조회
        Notice notice = noticeService.findById(noticeId);
        
        // 2. 파일 정보 확인
        if (notice.getFileName() == null || notice.getFilePath() == null) {
            return ResponseEntity.notFound().build();
        }
        
        // 3. 파일 리소스 로드
        Path filePath = Paths.get(notice.getFilePath());
        Resource resource = new FileSystemResource(filePath);
        
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        // 4. 응답 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + notice.getFileName() + "\"");
        headers.add(HttpHeaders.CONTENT_TYPE, 
                    MediaType.APPLICATION_OCTET_STREAM_VALUE);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}
```

## 2. 여러 파일 다운로드 (선택사항)

### 엔드포인트
```
GET /api/admin/notices/{noticeId}/files/{fileIndex}
```

### 구현 예시
```java
@GetMapping("/{noticeId}/files/{fileIndex}")
public ResponseEntity<Resource> downloadFileByIndex(
        @PathVariable Long noticeId, 
        @PathVariable int fileIndex) {
    
    Notice notice = noticeService.findById(noticeId);
    List<NoticeFile> files = notice.getFiles();
    
    if (files == null || fileIndex >= files.size()) {
        return ResponseEntity.notFound().build();
    }
    
    NoticeFile file = files.get(fileIndex);
    // 이하 동일한 파일 다운로드 로직
}
```

## 3. 파일 업로드 시 저장 위치

파일 업로드 시 다음과 같이 저장하는 것을 권장합니다:

```java
// application.properties
file.upload.dir=/uploads/notices/

// 파일 저장 로직
String uploadDir = uploadPath + "/notices/" + notice.getId() + "/";
String fileName = UUID.randomUUID() + "_" + originalFileName;
Path filePath = Paths.get(uploadDir + fileName);
Files.copy(file.getInputStream(), filePath);

// DB에 저장
notice.setFileName(originalFileName);
notice.setFilePath(filePath.toString());
```

## 4. 보안 고려사항

1. **경로 탐색 공격 방지**
```java
String fileName = Paths.get(requestedFileName).getFileName().toString();
```

2. **권한 확인**
```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Resource> downloadFile(...) {
    // ...
}
```

3. **파일 크기 제한**
```java
if (resource.contentLength() > MAX_FILE_SIZE) {
    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
}
``` 