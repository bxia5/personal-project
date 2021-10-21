import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectResourceService} from "../projectResource.service";
import {Subscription} from "rxjs";


@Component({
  selector: "project-list",
  templateUrl: "projectList.component.html",
  styleUrls: ["project.component.css"]
})

export class ProjectListComponent implements OnInit, OnDestroy{


  isLoading: Boolean = false;
  userIsAuthenticated: Boolean = false;
  userId: number = 0;
  projectForm: any;
  reviewForm: any;
  deleteForm: any;

  private authStatusSub: Subscription = new Subscription();

  constructor(public authService: AuthService, public projectService: ProjectResourceService,
              private fb:FormBuilder, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    if(typeof(this.authService.obj.id) == undefined) {
      this.userId = 0;
    }else{
      this.userId = this.authService.obj.id;
    }
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    (isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
      //this.userId = this.authService.getUserId();
    })
    if (this.userId != 0)
      this.projectService.getProjects(this.userId);
      //this.projectList = this.projectService.projects;
      //console.log(this.projectService.projects);

    this.projectForm = this.fb.group({
      name: ["new-project", [Validators.minLength(2), Validators.maxLength(30), Validators.required]]
    });
    this.reviewForm = this.fb.group({
      index: ["1", Validators.required]
    });
    this.deleteForm = this.fb.group({
      index: ["1", Validators.required]
    });


  }

  newProject(){
    this.isLoading = true;
    this.projectService.createProject(this.userId, this.projectForm.value.name);
  }

  review(){
    if(this.reviewForm.value.index > this.projectService.projects.length){
      this.projectService.projectId = this.projectService.projects[0].id;
    }else{
      this.projectService.projectId = this.projectService.projects[this.reviewForm.value.index - 1].id;
    }
    this.router.navigate(['/project']);
    //console.log(this.projectService.projectId);
  }

  delete(){
    if(this.deleteForm.value.index >= this.projectService.projects.length){
      this.projectService.deleteProject(this.projectService.projects[this.projectService.projects.length - 1].id, this.userId); ;
    }else{
      this.projectService.deleteProject(this.projectService.projects[this.reviewForm.value.index - 1].id, this.userId);
    }

  }

  //Not finish yet
  ngOnDestroy(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
  }
}
