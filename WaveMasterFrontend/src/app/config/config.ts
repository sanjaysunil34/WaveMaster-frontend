import { HttpHeaders } from "@angular/common/http";

export const BaseUrl = "http://localhost:3000";

export const httpHeader = () => {
    return {
        headers:new HttpHeaders({
          'Content-Type': 'application/json',      
        })
    }
} 