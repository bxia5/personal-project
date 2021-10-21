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

  constructor(public authService: AuthService, public projectService: ProjectResourceService,
              private fb:FormBuilder, private route:ActivatedRoute, private router:Router) { }

  private authStatusSub: Subscription = new Subscription();


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      })
    this.projectService.getAllResources();
    this.resourceForm = this.fb.group({
      name: ["Resource Name", Validators.required],
      code: ["Resource Code", Validators.required]
    });
  }

  addToAll(){
    this.projectService.createResource(this.resourceForm.value.name, this.resourceForm.value.code);
  }
  ngOnDestroy(): void {

  }
}
