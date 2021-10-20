import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../auth/auth.service";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: "project-list",
  templateUrl: "projectList.component.html",
  styleUrls: ["project.component.css"]
})

export class ProjectListComponent implements OnInit, OnDestroy{

  constructor(public authService: AuthService, private fb:FormBuilder, private route:ActivatedRoute, private router:Router) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
