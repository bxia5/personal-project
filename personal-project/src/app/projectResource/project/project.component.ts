import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {ProjectResourceService} from "../projectResource.service";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: "project",
  templateUrl: "project.component.html",
  styleUrls: ["project.component.css"]
})

export class ProjectComponent implements OnInit, OnDestroy{


  constructor(public authService: AuthService, public projectService: ProjectResourceService,
              private fb:FormBuilder, private route:ActivatedRoute, private router:Router) {}

  ngOnInit(): void {
    this.projectService.getProject(this.projectService.projectId);
  }
  ngOnDestroy(): void {

  }
}
