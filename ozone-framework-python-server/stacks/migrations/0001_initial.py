# Generated by Django 2.2.1 on 2019-08-15 21:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('owf_groups', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Stack',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('version', models.BigIntegerField()),
                ('name', models.CharField(max_length=256)),
                ('description', models.CharField(blank=True, max_length=4000, null=True)),
                ('stack_context', models.CharField(max_length=200, unique=True)),
                ('image_url', models.CharField(blank=True, max_length=2083, null=True)),
                ('descriptor_url', models.CharField(blank=True, max_length=2083, null=True)),
                ('unique_widget_count', models.BigIntegerField(blank=True, null=True)),
                ('approved', models.BooleanField(blank=True, null=True)),
                ('default_group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='owf_groups.OwfGroup')),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'stack',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='StackGroups',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='owf_groups.OwfGroup')),
                ('stack', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='stacks.Stack')),
            ],
            options={
                'db_table': 'stack_groups',
                'managed': True,
                'unique_together': {('group', 'stack')},
            },
        ),
    ]
