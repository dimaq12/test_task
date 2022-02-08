import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { FilesService } from './files-service';
import { AuthService } from '../auth-service';


@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  filesList: any;
  fileMeta: any;
  error: any;
  fileForm!: FormGroup;
  constructor(
    private readonly filesService: FilesService,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly auth: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.filesService.getFilesList().subscribe((filesList) => {
      this.filesList = filesList;
    });

    this.fileForm = new FormGroup({
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    });
  }

  upload(): void{
    let formData = new FormData();
    const file = this.fileForm.get('fileSource')?.value;
    if(!file) {
      return;
    }

    formData.append('file', file)

    this.filesService.upload(formData).pipe(
      switchMap(() => this.filesService.getFilesList())
    ).subscribe({
      next: (filesList) => {
        this.filesList = filesList;
        this.removeFile()
      },
      error: (e) => {
        this.toastr.error(e.error,);
        this.removeFile()
      },
    });
  }

  onFileChange($event: any): void {
    if ($event.target.files.length > 0) {
      const file = $event.target.files[0];
      const { name, size, type } = file;
      if(size / (1024 * 1024) >  5) {
        this.toastr.error("File is too large");
        this.removeFile()
        return;
      }
      this.fileMeta = { name, size, type };
      this.fileForm.patchValue({
        fileSource: file
      });
    }
  }

  removeFile(): void{
    this.fileMeta = null;
    this.fileForm.patchValue({
      fileSource: ''
    });
  }
 
  download(file: any): void {
    const fileId = file.fileId;
    this.filesService.downloadFile(fileId).subscribe((res) => {
      const blob = new Blob([res], { type: file.mimetype });
      const url= window.URL.createObjectURL(blob);
      const a = this.document.createElement('a');
      a.href = url;
      a.download = `${ file.originalname }`;
      this.document.body.appendChild(a);
      a.click();
      this.document.body.removeChild(a);
    })
  }

  logOut() {
    this.auth.logOut()
  }
}
