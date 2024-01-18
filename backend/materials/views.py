from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from .models import *

# class check_material_availability(APIView): 
#     def get(self,request,pk): 
#         try: 
#             material = Material.objects.get(material_id = pk)
            
#             if(material.quantity)
#             # ticket = TicketSerializer(Ticket.objects.get(ticket_id = pk))
#             # return Response(ticket.data)
#         except:
#             raise NotFound("Ticket not found") 



