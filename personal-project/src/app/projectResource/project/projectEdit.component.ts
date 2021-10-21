import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {ProjectResourceService} from "../projectResource.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: "project-edit",
  templateUrl: "projectEdit.component.html",
  styleUrls: ["project.component.css"]
})

export class ProjectEditComponent implements OnInit, OnDestroy{

  addForm: any;
  removeForm: any;
  private lock: Boolean = true;
  constructor(public authService: AuthService, public projectService: ProjectResourceService,
              private fb:FormBuilder, private route:ActivatedRoute, private router:Router) {}


  back(){
    this.router.navigate(["/project"]);
  }

  add(){
    if(this.addForm.value.index > 0 && this.addForm.value.index - 1 <= this.projectService.allResources.length){
      let id = this.projectService.allResources[this.addForm.value.index - 1].id;
      for(let i = 0; i < this.projectService.resources.length; i++){
        if(id == this.projectService.resources[i].id)
          this.lock = false;
      }

      if(this.lock){
        this.projectService.addResource(this.projectService.projectId, this.projectService.allResources[this.addForm.value.index - 1].id);
        this.projectService.getProject(this.projectService.projectId);
        this.projectService.getAllResources();
      }
      this.lock = true;
    }
  }

  remove(){
    if(this.removeForm.value.index > 0 && this.removeForm.value.index - 1 <= this.projectService.resources.length){
      this.projectService.removeResource(this.projectService.projectId, this.projectService.resources[this.removeForm.value.index - 1].id);
      this.projectService.getProject(this.projectService.projectId);
      this.projectService.getAllResources();
    }
  }
  ngOnInit(): void {
    this.projectService.getProject(this.projectService.projectId);
    this.projectService.getAllResources();
    this.addForm = this.fb.group({
      index: ["1", Validators.required]
    });
    this.removeForm = this.fb.group({
      index: ["1", Validators.required]
    });
  }
  ngOnDestroy(): void {

  }
}
