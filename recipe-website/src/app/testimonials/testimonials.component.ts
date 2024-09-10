import { Component,OnInit,OnDestroy } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit,OnDestroy {
  reviews: any;
  private subscription:Subscription | undefined;
  

  constructor(private supabase: SupabaseService) {
    
  }
  ngOnInit(): void {
    this.supabase.allReviews().then(reviews => {
      this.reviews = reviews;
      console.log(this.reviews);
    });
    this.supabase.subscribeToReviews();
    this.supabase.reviewChanges$.subscribe(reviews => {
      this.reviews = reviews;
      console.log('Updated Reviews:', this.reviews);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }



}