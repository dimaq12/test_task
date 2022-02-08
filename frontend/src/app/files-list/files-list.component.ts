import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { FilesService } from './files-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  filesList: any;
  fileForm!: FormGroup;
  constructor(
    private readonly filesService: FilesService,
    @Inject(DOCUMENT) private readonly document: Document,
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
    ).subscribe((filesList) => {
      this.filesList = filesList;
    });
  }

  onFileChange($event: any) {
    if ($event.target.files.length > 0) {
      const file = $event.target.files[0];
      this.fileForm.patchValue({
        fileSource: file
      });
    }
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
}
