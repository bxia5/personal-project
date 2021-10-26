import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {ProjectResourceService} from "../projectResource.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: "project",
  templateUrl: "project.component.html",
  styleUrls: ["project.component.css"]
})

export class ProjectComponent implements OnInit, OnDestroy{

  columnForm: any;
  removeForm: any;
  addColumn: Boolean = false;
  errorMessage: string = "";
  error: Boolean = false;

  constructor(public authService: AuthService, public projectService: ProjectResourceService,
              private fb:FormBuilder, private route:ActivatedRoute, private router:Router) {}

  editProject(){
    this.router.navigate(["/project-edit"]);
  }

  ngOnInit(): void {
    this.projectService.getProject(this.projectService.projectId);
    this.projectService.getProjectColumns();
    this.columnForm = this.fb.group({
      name: ["Name", Validators.required],
      formula: ["Formula", Validators.required]
    });
    this.removeForm = this.fb.group({
      name: ["Name", Validators.required]
    });
  }

  editColumn(){
    this.addColumn = true;
  }
  back(){
    this.errorMessage = "";
    this.error = false;
    this.addColumn = false;
  }

  createColumn(){
    this.errorMessage = "";
    this.error = false;
    let check = false;
    let name = this.columnForm.value.name;
    for(let i = 0; i < this.projectService.projectColumns.length; i++) {
      if (name == this.projectService.projectColumns[i].columnName) {
        check = true;
        break;
      }
    }
    this.error = check;
    if(!check) {
      this.projectService.addProjectColumn(this.columnForm.value.name, this.columnForm.value.formula)
    }else{
      this.errorMessage = "The column name exists " + this.columnForm.value.name;
    }
    //this.numColumn = 1;

  }

  dropColumn(){
    this.errorMessage = "";
    this.error = false;
    let check = false;
    let name = this.removeForm.value.name;
    for(let i = 0; i < this.projectService.projectColumns.length; i++) {
      if (name == this.projectService.projectColumns[i].columnName) {
        this.projectService.dropColumn(name);
        check = true;
        break;
      }
    }
    this.error = !check;
    this.errorMessage = "No such column named " + this.removeForm.value.name;
  }

  ngOnDestroy(): void {

  }
}
