import { HttpHeaders } from "@angular/common/http";

export const BASE_URL = "http://localhost:3000";

export const httpHeader = () => {
    return {
        headers:new HttpHeaders({
          'Content-Type': 'application/json',      
        })
    }
} 