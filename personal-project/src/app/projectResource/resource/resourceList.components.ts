import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {ProjectResourceService} from "../projectResource.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: "resource-list",
  templateUrl: "resourceList.component.html",
  styleUrls: ["resource.component.css"]
})

export class ResourceListComponent implements OnInit, OnDestroy{

  userIsAuthenticated: Boolean = false;
  resourceForm: any;
  columnForm: any;
  removeForm: any;
  addRow: Boolean = false;
  addColumn: Boolean = false;
  errorMessage: string = "";
  error: Boolean = false;

  constructor(public authService: AuthService, public projectService: ProjectResourceService,
              private fb:FormBuilder, private route:ActivatedRoute, private router:Router) { }

  private authStatusSub: Subscription = new Subscription();


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      })
    this.projectService.getAllResources();
    this.projectService.getColumns();
    this.resourceForm = this.fb.group({
      name: ["Name", Validators.required],
      code: ["Code", Validators.required]
    });
    this.columnForm = this.fb.group({
      name: ["Name", Validators.required],
      formula: ["Formula", Validators.required]
    });
    this.removeForm = this.fb.group({
      name: ["Name", Validators.required]
    });
    //this.numColumn = this.projectService.columns.length;
  }

  addARow(){
    this.addRow = true;
    this.addColumn = false;
  }

  addAColumn(){
    this.addColumn = true;
    this.addRow = false;
  }

  createColumn(){
    this.errorMessage = "";
    this.error = false;
    let check = false;
    let name = this.columnForm.value.name;
    for(let i = 0; i < this.projectService.columns.length; i++) {
      if (name == this.projectService.columns[i].columnName) {
        check = true;
        break;
      }
    }
    this.error = check;
    if(!check) {
      this.projectService.addColumn(this.columnForm.value.name, this.columnForm.value.formula)
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
    for(let i = 0; i < this.projectService.columns.length; i++) {
      if (name == this.projectService.columns[i].columnName) {
        this.projectService.dropColumn(name);
        check = true;
        break;
      }
    }
    this.error = !check;
    this.errorMessage = "No such column named " + this.removeForm.value.name;
  }

  back(){
    this.errorMessage = "";
    this.error = false;
    this.addColumn = false;
    this.addRow = false;
  }
  addToAll(){
    this.projectService.createResource(this.resourceForm.value.name, this.resourceForm.value.code);
  }
  ngOnDestroy(): void {

  }
}
